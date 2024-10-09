import ffmpeg from "@motion-canvas/ffmpeg";
import motionCanvas from "@motion-canvas/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
});
