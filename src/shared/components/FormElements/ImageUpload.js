import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const filePickerRef = useRef();
  const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/dpn3kymkd/image/upload"; // ✅ Corrected
  const UPLOAD_PRESET = "wanderwise"; // ✅ Correct Upload Preset

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewUrl(fileReader.result);
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      setFile(pickedFile);
      uploadToCloudinary(pickedFile);
    }
  };

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); // ✅ Required by Cloudinary

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedImageUrl = response.data.secure_url;
      setImageUrl(uploadedImageUrl);

      // ✅ Send image URL to parent component
      if (props.onInput) {
        props.onInput(props.id, uploadedImageUrl, true);
      } else {
        console.warn("onInput function is missing in ImageUpload props");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    setUploading(false);
  };

  const pickImageHandler = () => filePickerRef.current.click();

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Please pick an image.</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler} disabled={uploading}>
          {uploading ? "Uploading..." : "PICK IMAGE"}
        </Button>
      </div>
      {imageUrl && (
        <p>
          Uploaded Image:{" "}
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
