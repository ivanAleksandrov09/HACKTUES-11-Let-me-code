import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";

export default function PDFenter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSubmit = async () => {
    setError(null);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.click();

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];

      if (!file) {
        toast.error("No file selected");
        return;
      }

      if (file.type !== "application/pdf") {
        toast.error("Please select a valid PDF file");
        return;
      }

      setLoading(true);
      const id = toast.loading("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/api/bank-statement/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success("File uploaded successfully!", { id });
          setLoading(false);
        } else {
          toast.error("File upload failed. Please try again.", { id });
          setLoading(false);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setLoading(false);
        toast.error("An error occurred during file upload.", { id });
      }
    };
  };

  return (
    <div className="input_box">
      <button
        className="submit_btn"
        type="submit"
        onClick={handleFileSubmit}
        disabled={loading}
      >
        Upload statement
      </button>
    </div>
  );
}
