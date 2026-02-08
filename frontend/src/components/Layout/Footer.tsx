export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-2">FarmVibes.AI</h3>
            <p className="text-sm">
              Multi-modal geospatial ML models for agriculture and sustainability.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">Links</h4>
            <ul className="text-sm space-y-1">
              <li>
                <a
                  href="https://microsoft.github.io/farmvibes-ai/"
                  className="hover:text-white transition"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/microsoft/farmvibes-ai"
                  className="hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">Version</h4>
            <p className="text-sm">Frontend v0.1.0</p>
            <p className="text-sm">API v0</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Microsoft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
