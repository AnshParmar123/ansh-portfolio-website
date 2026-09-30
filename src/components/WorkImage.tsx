import { memo, useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");

  useEffect(() => {
    return () => {
      if (video) URL.revokeObjectURL(video);
    };
  }, [video]);

  const handleMouseEnter = async () => {
    if (props.video && !video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
      return;
    }

    if (props.video) setIsVideo(true);
  };

  const media = (
    <>
      <img src={props.image} alt={props.alt} loading="lazy" decoding="async" />
      {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
    </>
  );

  return (
    <div className="work-image">
      {props.link ? (
        <a
          className="work-image-in"
          href={props.link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVideo(false)}
          target="_blank"
          rel="noreferrer"
          data-cursor="disable"
          aria-label={`Open ${props.alt ?? "project"} project link`}
        >
          <div className="work-link">
            <MdArrowOutward />
          </div>
          {media}
        </a>
      ) : (
        <div
          className="work-image-in"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVideo(false)}
        >
          {media}
        </div>
      )}
    </div>
  );
};

export default memo(WorkImage);
