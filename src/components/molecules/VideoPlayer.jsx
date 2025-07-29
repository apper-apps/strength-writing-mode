import React from "react";

const VideoPlayer = ({ videoId, title, className = "" }) => {
  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400">📹</span>
          </div>
          <p className="text-gray-500">비디오를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-container ${className}`}>
      <iframe 
        src={`https://video.adilo.com/${videoId}`}
        title={title || "Course Video"}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default VideoPlayer;