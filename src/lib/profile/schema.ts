import { z } from "zod";

export const profileSchema = z.object({
  ftp: z.preprocess((val) => {
    if (val === "" || val == null) return null;
    return Number(val);
  }, z.number("Please enter a number").int("whole numbers only").min(50, "FTP must be at least 50 W").max(600, "FTP can be 600 W at most").nullable()),

  max_hr: z.preprocess((val) => {
    if (val === "" || val == null) return null;
    return Number(val);
  }, z.number("Please enter a number").int("whole numbers only").min(130, "Max heart rate must be at least 130").max(230, "Max heart rate can be 230 at most").nullable()),

  lthr: z.preprocess((val) => {
    if (val === "" || val == null) return null;
    return Number(val);
  }, z.number("Please enter a number").int("whole numbers only").min(120, "Threshold heart rate must be at least 120").max(210, "Threshold heart rate can be 210 at most").nullable()),
});
