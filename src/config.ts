export type BirthdayPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type BirthdayConfig = {
  recipientName: string;
  closingMessage: string;
  photos: BirthdayPhoto[];
  song: {
    src: string;
    title: string;
  };
};

const assetBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const publicAsset = (path: string) => `${assetBase}${path.replace(/^\/+/, "")}`;
/**
 * This is the only file you need to edit for personalization.
 * Replace the four placeholder files in public/photos, then update their paths.
 * Add an owned audio file to public/music and set song.src to show the music button.
 */
export const birthdayConfig: BirthdayConfig = {
  recipientName: "Priya",
  closingMessage:
    "May this year be gentle, exciting, and full of beautiful reasons to smile.",
  photos: [
    {
      src: publicAsset("/photos/photo-1.jpeg"),
      alt: "A warm placeholder for the first birthday portrait",
      caption: "A little more light"
    },
    {
      src: publicAsset("/photos/photo-2.jpeg"),
      alt: "A rosy placeholder for the second birthday portrait",
      caption: "Making ordinary days prettier"
    },
    {
      src: publicAsset("/photos/photo-3.jpeg"),
      alt: "A golden placeholder for the third birthday portrait",
      caption: "An effortless kind of lovely"
    },
    {
      src: publicAsset("/photos/photo-4.png"),
      alt: "A burgundy placeholder for the fourth birthday portrait",
      caption: "The moment, but brighter"
    }
  ],
  song: {
    src: publicAsset("/music/Aankhon Se Batana Dikshant 128 Kbps.mp3"),
    title: "A song for today"
  }
};
