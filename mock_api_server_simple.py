#!/usr/bin/env python3
"""
Simple mock API server for FarmVibes.AI frontend testing
Uses only Python standard library - no external dependencies
Runs on localhost:31108 with the same API contract
"""

import json
import uuid
import random
from datetime import datetime, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time


def generate_time_series_visualization():
    """Generate mock time series visualization data for NDVI growth"""
    data = []
    start_date = datetime(2023, 4, 1)
    
    for i in range(150):
        date = start_date + timedelta(days=i)
        progress = i / 150
        
        # Sigmoid growth curve
        growth = 0.2 + 0.5 * (1 / (1 + 2.718 ** (-10 * (progress - 0.5))))
        ndvi = growth + (random.random() * 0.05 - 0.025)
        
        data.append({
            "date": date.isoformat().split('T')[0],
            "ndvi": max(0, min(1, ndvi)),
            "confidence": 0.85 + random.random() * 0.1,
            "evi": ndvi * 0.85 + random.random() * 0.05
        })
    
    return {
        "type": "timeseries",
        "title": "NDVI Growth Pattern",
        "description": "Vegetation Index over growing season",
        "unit": "NDVI",
        "data": data,
        "series": [
            {"key": "ndvi", "name": "NDVI (Normalized Difference Vegetation Index)", "color": "#10b981"},
            {"key": "evi", "name": "EVI (Enhanced Vegetation Index)", "color": "#3b82f6"}
        ],
        "xAxisLabel": "Date",
        "yAxisLabel": "Index Value"
    }


def generate_categorical_visualization():
    """Generate mock categorical map visualization for crop classification"""
    classes = [
        {"value": 1, "label": "Corn", "color": "#fcd34d"},
        {"value": 2, "label": "Wheat", "color": "#d4a373"},
        {"value": 3, "label": "Soybean", "color": "#86efac"},
        {"value": 4, "label": "Water", "color": "#38bdf8"},
        {"value": 5, "label": "Forest", "color": "#15803d"},
        {"value": 6, "label": "Urban", "color": "#808080"}
    ]
    
    total_pixels = 1000000
    
    return {
        "type": "categorical",
        "title": "Crop Classification Map",
        "description": "Machine learning based crop type classification",
        "classes": classes,
        "statistics": {
            "total_pixels": total_pixels,
            "class_distribution": {
                "1": int(total_pixels * 0.35),
                "2": int(total_pixels * 0.30),
                "3": int(total_pixels * 0.15),
                "4": int(total_pixels * 0.10),
                "5": int(total_pixels * 0.08),
                "6": int(total_pixels * 0.02)
            }
        }
    }


def generate_carbon_visualization():
    """Generate mock carbon sequestration time series"""
    data = []
    scenarios = {
        "baseline": 20,
        "conservation_tillage": 20.5,
        "cover_crops": 20.8,
        "no_till": 21.2
    }
    
    for year in range(2020, 2031):
        point = {"date": str(year)}
        years_elapsed = year - 2020
        
        for scenario, base_rate in scenarios.items():
            if scenario == "baseline":
                point[scenario] = base_rate + random.random() * 2
            elif scenario == "conservation_tillage":
                point[scenario] = base_rate + (years_elapsed * 0.5) + random.random() * 2
            elif scenario == "cover_crops":
                point[scenario] = base_rate + (years_elapsed * 0.8) + random.random() * 2
            else:  # no_till
                point[scenario] = base_rate + (years_elapsed * 1.2) + random.random() * 2
        
        data.append(point)
    
    return {
        "type": "timeseries",
        "title": "Soil Carbon Sequestration Potential",
        "description": "Carbon accumulation under different farming practices",
        "unit": "Mg C/ha",
        "data": data,
        "series": [
            {"key": "baseline", "name": "Baseline (Current Practice)", "color": "#ef4444"},
            {"key": "conservation_tillage", "name": "Conservation Tillage", "color": "#f97316"},
            {"key": "cover_crops", "name": "Cover Crops", "color": "#3b82f6"},
            {"key": "no_till", "name": "No-Till (Best)", "color": "#10b981"}
        ],
        "xAxisLabel": "Year",
        "yAxisLabel": "Soil Carbon (Mg C/ha)"
    }


class MockAPIHandler(BaseHTTPRequestHandler):
    """HTTP request handler for the mock API"""
    
    # Class variable to store runs
    runs_store = {}
    
    # Workflows data
    WORKFLOWS = [
        {
            "name": "helloworld",
            "description": "Simple example to get started with FarmVibes.AI",
            "inputs": [
                {"name": "region", "type": "string", "description": "Region name", "required": False}
            ],
            "outputs": [
                {"name": "result", "type": "string", "description": "Result data"}
            ]
        },
        {
            "name": "harvest_period",
            "description": "Detect harvest dates using NDVI time-series from Sentinel 2 data",
            "inputs": [],
            "outputs": [
                {"name": "ndvi_data", "type": "raster", "description": "NDVI time series"}
            ]
        },
        {
            "name": "carbon",
            "description": "Estimate soil carbon footprint based on agriculture practices",
            "inputs": [
                {"name": "practice", "type": "string", "description": "Agricultural practice"}
            ],
            "outputs": [
                {"name": "carbon_estimate", "type": "float", "description": "Carbon estimate in tons"}
            ]
        },
        {
            "name": "crop_segmentation",
            "description": "Train and apply crop identification models based on NDVI data",
            "inputs": [
                {"name": "model_name", "type": "string", "description": "Model identifier"}
            ],
            "outputs": [
                {"name": "segmentation_map", "type": "raster", "description": "Crop segmentation map"}
            ]
        },
        {
            "name": "irrigation_classification",
            "description": "Classify irrigated vs rain-fed fields",
            "inputs": [],
            "outputs": [
                {"name": "irrigation_map", "type": "raster", "description": "Irrigation classification"}
            ]
        },
        {
            "name": "weed_detection",
            "description": "Identify and map weed presence in agricultural fields",
            "inputs": [],
            "outputs": [
                {"name": "weed_map", "type": "raster", "description": "Weed detection map"}
            ]
        },
        {
            "name": "forest_change_detection",
            "description": "Monitor forest coverage changes over time using satellite data",
            "inputs": [
                {"name": "start_year", "type": "integer", "description": "Start year"},
                {"name": "end_year", "type": "integer", "description": "End year"}
            ],
            "outputs": [
                {"name": "change_map", "type": "raster", "description": "Forest change map"}
            ]
        },
        {
            "name": "ghg_fluxes",
            "description": "Calculate greenhouse gas emissions from agricultural activities",
            "inputs": [],
            "outputs": [
                {"name": "ghg_estimate", "type": "float", "description": "GHG emissions estimate"}
            ]
        },
    ]
    
    def send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        # Root endpoint
        if path == "/v0/":
            self.send_json_response({"status": "ok", "service": "farmvibes-ai-mock-api"})
            return
        
        # List workflows
        if path == "/v0/workflows":
            self.send_json_response(self.WORKFLOWS)
            return
        
        # Describe workflow
        if path.startswith("/v0/workflows/"):
            workflow_name = path.split("/")[-1]
            workflow = next((w for w in self.WORKFLOWS if w["name"] == workflow_name), None)
            if workflow:
                self.send_json_response(workflow)
            else:
                self.send_json_response({"error": "Workflow not found"}, 404)
            return
        
        # List runs
        if path == "/v0/runs":
            skip = int(query_params.get("skip", [0])[0])
            take = int(query_params.get("take", [50])[0])
            
            runs_list = list(self.runs_store.values())
            total = len(runs_list)
            
            # Sort by start_time descending
            runs_list.sort(key=lambda r: r["start_time"], reverse=True)
            
            self.send_json_response({
                "items": runs_list[skip:skip+take],
                "total": total,
                "skip": skip,
                "take": take
            })
            return
        
        # Get single run
        if path.startswith("/v0/runs/") and path.count("/") == 3:
            run_id = path.split("/")[-1]
            run = self.runs_store.get(run_id)
            if run:
                # Simulate status progression
                elapsed = (datetime.utcnow() - datetime.fromisoformat(run["start_time"].replace("Z", "+00:00"))).total_seconds()
                
                if run["status"] == "submitted" and elapsed > 2:
                    run["status"] = "running"
                elif run["status"] == "running" and elapsed > 5:
                    run["status"] = "completed"
                    run["end_time"] = datetime.utcnow().isoformat() + "Z"
                    
                    # Add visualization data based on workflow
                    workflow = run.get("workflow", "")
                    if workflow == "harvest_period":
                        run["output"] = [{
                            "name": "ndvi_timeseries.json",
                            "mime_type": "application/json",
                            "type": "timeseries",
                            "visualization": generate_time_series_visualization(),
                            "url": "https://example.com/ndvi_timeseries.json"
                        }]
                    elif workflow == "crop_segmentation":
                        run["output"] = [{
                            "name": "crop_classification.tif",
                            "mime_type": "image/tiff",
                            "type": "categorical",
                            "visualization": generate_categorical_visualization(),
                            "url": "https://example.com/crop_classification.tif"
                        }]
                    elif workflow == "carbon":
                        run["output"] = [{
                            "name": "carbon_sequestration.json",
                            "mime_type": "application/json",
                            "type": "timeseries",
                            "visualization": generate_carbon_visualization(),
                            "url": "https://example.com/carbon_sequestration.json"
                        }]
                    elif workflow == "irrigation_classification":
                        run["output"] = [{
                            "name": "irrigation_map.tif",
                            "mime_type": "image/tiff",
                            "type": "categorical",
                            "visualization": generate_categorical_visualization(),
                            "url": "https://example.com/irrigation_map.tif"
                        }]
                    else:
                        # Default outputs
                        run["output"] = [
                            {
                                "name": "results.json",
                                "mime_type": "application/json",
                                "type": "timeseries",
                                "visualization": generate_time_series_visualization(),
                                "url": "https://example.com/results.json"
                            }
                        ]
                
                self.send_json_response(run)
            else:
                self.send_json_response({"error": "Run not found"}, 404)
            return
        
        # System metrics
        if path == "/v0/system-metrics":
            try:
                import psutil
                self.send_json_response({
                    "cpu_percent": psutil.cpu_percent(interval=0.1),
                    "memory_percent": psutil.virtual_memory().percent,
                    "disk_percent": psutil.disk_usage("/").percent,
                    "available_memory_gb": psutil.virtual_memory().available / (1024**3),
                    "total_memory_gb": psutil.virtual_memory().total / (1024**3)
                })
            except ImportError:
                # Fallback if psutil not available
                self.send_json_response({
                    "cpu_percent": 25.5,
                    "memory_percent": 45.2,
                    "disk_percent": 62.1,
                    "available_memory_gb": 8.5,
                    "total_memory_gb": 16.0
                })
            return
        
        # 404
        self.send_json_response({"error": "Not found"}, 404)
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Submit run
        if path == "/v0/runs":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())
            
            run_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat() + "Z"
            
            run = {
                "id": run_id,
                "workflow": data.get("workflow"),
                "name": data.get("name", "Untitled"),
                "start_time": now,
                "status": "submitted",
                "output": [],
                "parameters": data.get("parameters", {})
            }
            
            self.runs_store[run_id] = run
            self.send_json_response(run, 201)
            return
        
        # Cancel run
        if path.endswith("/cancel"):
            run_id = path.split("/")[-2]
            run = self.runs_store.get(run_id)
            if run:
                run["status"] = "cancelled"
                self.send_json_response({"status": "ok"})
            else:
                self.send_json_response({"error": "Run not found"}, 404)
            return
        
        # 404
        self.send_json_response({"error": "Not found"}, 404)
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Delete run
        if path.startswith("/v0/runs/") and path.count("/") == 3:
            run_id = path.split("/")[-1]
            if run_id in self.runs_store:
                del self.runs_store[run_id]
                self.send_json_response({"status": "ok"})
            else:
                self.send_json_response({"error": "Run not found"}, 404)
            return
        
        # 404
        self.send_json_response({"error": "Not found"}, 404)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to customize logging"""
        print(f"[{self.log_date_time_string()}] {format % args}")


def start_mock_api(port=31108):
    """Start the mock API server"""
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, MockAPIHandler)
    
    print(f"""
╔════════════════════════════════════════════════════════════════╗
║     FarmVibes.AI Mock API Server (Testing Only)               ║
║     http://localhost:{port}                                    ║
║                                                                ║
║     Available endpoints:                                      ║
║     - GET  /v0/workflows                                      ║
║     - GET  /v0/workflows/<name>                               ║
║     - GET  /v0/runs                                           ║
║     - POST /v0/runs                                           ║
║     - GET  /v0/runs/<id>                                      ║
║     - GET  /v0/system-metrics                                 ║
║     - POST /v0/runs/<id>/cancel                               ║
║     - DELETE /v0/runs/<id>                                    ║
║                                                                ║
║     API is fully functional for frontend testing              ║
║     Press Ctrl+C to stop                                      ║
╚════════════════════════════════════════════════════════════════╝
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
        httpd.shutdown()


if __name__ == "__main__":
    start_mock_api()
