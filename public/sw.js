self.addEventListener("install", (event) => {
    console.log("Service Worker: Installed");
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activated");
  });
  
  self.addEventListener("fetch", (event) => {
    // Add caching logic here if needed
  });
  