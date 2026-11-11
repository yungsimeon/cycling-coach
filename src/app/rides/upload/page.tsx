import { uploadRide } from "../actions";

export default function UploadRidePage() {
  return (
    <div>
      <form action={uploadRide}>
        <label htmlFor="file">FIT file</label>
        <input type="file" name="file" id="file" accept=".fit" />
        <button type="submit">Upload FIT file</button>
      </form>
    </div>
  );
}
