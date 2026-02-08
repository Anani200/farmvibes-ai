#!/usr/bin/env python3
"""
Simple mock API server for FarmVibes.AI frontend testing
Runs on localhost:31108 with the same API contract
"""

from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import uuid
import json

app = Flask(__name__)

# Mock data
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
]

RUNS = {}

@app.route("/v0/", methods=["GET"])
def root():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "farmvibes-ai-mock-api"})

@app.route("/v0/workflows", methods=["GET"])
def list_workflows():
    """List all workflows"""
    return jsonify(WORKFLOWS)

@app.route("/v0/workflows/<workflow_name>", methods=["GET"])
def describe_workflow(workflow_name):
    """Get workflow details"""
    workflow = next((w for w in WORKFLOWS if w["name"] == workflow_name), None)
    if workflow:
        return jsonify(workflow)
    return jsonify({"error": "Workflow not found"}), 404

@app.route("/v0/runs", methods=["GET"])
def list_runs():
    """List all runs"""
    skip = request.args.get("skip", 0, type=int)
    take = request.args.get("take", 50, type=int)
    
    runs_list = list(RUNS.values())
    total = len(runs_list)
    
    # Sort by start_time descending
    runs_list.sort(key=lambda r: r["start_time"], reverse=True)
    
    return jsonify({
        "items": runs_list[skip:skip+take],
        "total": total,
        "skip": skip,
        "take": take
    })

@app.route("/v0/runs", methods=["POST"])
def submit_run():
    """Submit a new run"""
    data = request.get_json()
    
    run_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    
    run = {
        "id": run_id,
        "workflow": data.get("workflow"),
        "name": data.get("name", "Untitled"),
        "start_time": now,
        "status": "running",
        "output": [],
        "parameters": data.get("parameters", {})
    }
    
    RUNS[run_id] = run
    return jsonify(run), 201

@app.route("/v0/runs/<run_id>", methods=["GET"])
def get_run(run_id):
    """Get run details"""
    run = RUNS.get(run_id)
    if run:
        # Simulate status progression
        return jsonify(run)
    return jsonify({"error": "Run not found"}), 404

@app.route("/v0/runs/<run_id>/cancel", methods=["POST"])
def cancel_run(run_id):
    """Cancel a run"""
    run = RUNS.get(run_id)
    if run:
        run["status"] = "cancelled"
        return jsonify({"status": "ok"})
    return jsonify({"error": "Run not found"}), 404

@app.route("/v0/runs/<run_id>", methods=["DELETE"])
def delete_run(run_id):
    """Delete a run"""
    if run_id in RUNS:
        del RUNS[run_id]
        return jsonify({"status": "ok"})
    return jsonify({"error": "Run not found"}), 404

@app.route("/v0/system-metrics", methods=["GET"])
def system_metrics():
    """Get system metrics"""
    import psutil
    
    try:
        return jsonify({
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage("/").percent,
            "available_memory_gb": psutil.virtual_memory().available / (1024**3),
            "total_memory_gb": psutil.virtual_memory().total / (1024**3)
        })
    except:
        # Fallback if psutil not available
        return jsonify({
            "cpu_percent": 25.5,
            "memory_percent": 45.2,
            "disk_percent": 62.1,
            "available_memory_gb": 8.5,
            "total_memory_gb": 16.0
        })

@app.before_request
def handle_cors():
    """Handle CORS"""
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

@app.after_request
def after_request(response):
    """Add CORS headers"""
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    return response

if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════════════╗
    ║     FarmVibes.AI Mock API Server (Testing Only)               ║
    ║     http://localhost:31108                                    ║
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
    ║     Press Ctrl+C to stop                                      ║
    ╚════════════════════════════════════════════════════════════════╝
    """)
    
    app.run(
        host="127.0.0.1",
        port=31108,
        debug=False,
        use_reloader=False
    )
