const fs = require("fs");
const path = require("path");

const pkgPath = path.resolve(__dirname, "../node_modules/@tanstack/router-core/package.json");

if (fs.existsSync(pkgPath)) {
  try {
    const content = fs.readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(content);
    if (!pkg.exports) pkg.exports = {};
    pkg.exports["./scroll-restoration-script"] = {
      import: {
        types: "./dist/esm/scroll-restoration-script/client.d.ts",
        default: "./dist/esm/scroll-restoration-script/client.js",
      },
      require: {
        types: "./dist/cjs/scroll-restoration-script/client.cjs",
        default: "./dist/cjs/scroll-restoration-script/client.cjs",
      },
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
    console.log("[patch-router-core] Successfully added scroll-restoration-script export.");
  } catch (err) {
    console.error("[patch-router-core] Failed to patch router-core:", err);
  }
} else {
  console.log("[patch-router-core] router-core package.json not found, skipping patch.");
}
