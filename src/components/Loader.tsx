// components/Loader.js
interface LoaderProps {
  width?: number;
  height?: number;
}

export default function Loader({ width = 16, height = 16 }: LoaderProps) {
  return (
    <div className="flex justify-center items-center">
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
      ></div>
    </div>
  );
}
