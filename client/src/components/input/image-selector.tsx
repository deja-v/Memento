import { useEffect, useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
interface ImageSelectorProps {
  image: File | string | null;
  setImage: (image: File | string | null) => void;
  handleDeleteImg: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ image, setImage, handleDeleteImg }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null)
    handleDeleteImg();
  }

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    if (typeof image === "string") {
      setPreviewUrl(image);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <button
          className="w-full h-[220px] cursor-pointer flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-blue-400" />
          </div>
          <p className="text-sm text-slate-500">Browse Image Files to Upload</p>
        </button>
      ) : (
        <div className="w-full relative">
          <img src={previewUrl ?? ""} alt="Selected" className="w-full h-[300px] object-cover rounded-lg" />
          <button className="btn-small btn-delete absolute top-2 right-2" onClick={handleRemoveImage}>
            <MdDeleteOutline className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
