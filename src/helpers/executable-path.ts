function executablePath() {
  if (process.env.PRODUCTION_MODE === "development") {
    return {
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    };
  }
  return {};
}

export default executablePath;
