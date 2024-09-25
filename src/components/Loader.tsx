// components/Loader.js
interface LoaderProps {
  width?: string;
  height?: string;
}

export default function Loader({ width = "16", height = "16" }: LoaderProps) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${width} h-${height} border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin`}
      ></div>
    </div>
  );
}

  