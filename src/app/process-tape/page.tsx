import type { Metadata } from "next";
import ProcessTapeClient from "./ProcessTapeClient";

export const metadata: Metadata = {
  title: "Process Tape — Mohammad Hussain",
  description: "Raw decision log. How I actually think when building software.",
};

export default function ProcessTapePage() {
  return <ProcessTapeClient />;
}
