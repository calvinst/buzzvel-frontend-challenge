export const navLinks = [
  { label: "Courses", href: "#courses" },
  { label: "For Teams", href: "#featured" },
  { label: "Community", href: "#people" },
  { label: "About", href: "#how" },
];
export const categories = [
  { title: "Product Design", text: "Turn complex problems into clear, useful experiences." },
  { title: "Technology", text: "Build a stronger understanding of the tools shaping digital products." },
  { title: "Business", text: "Develop practical skills for better decisions and stronger teams." },
  { title: "Creative", text: "Explore new ways to communicate, create and tell stories." },
];
// Step icons: 56x56 box on the left; `bg` is the outer shape, `dot` the inner one.
export const steps = [
  {
    title: "Choose your focus",
    text: "Find courses based on the skill you want to build, not endless content categories.",
    bg: "absolute inset-0 rounded-full bg-[#E2E8FF]",
    dot: "absolute left-2 top-2 size-6 rounded-md bg-[#3157F6]",
  },
  {
    title: "Learn from experience",
    text: "Follow concise lessons created by professionals who use these skills.",
    bg: "absolute inset-0 rotate-[-12deg] rounded-lg bg-[#FFCB9F]",
    dot: "absolute left-6 top-6 size-7 rounded-full bg-[#FF704D]",
  },
  {
    title: "Put it into practice",
    text: "Every course includes practical exercises designed to turn knowledge into action.",
    bg: "absolute inset-0 rounded-xl bg-[#FFF1C2]",
    dot: "absolute left-2 top-7 size-5 rounded-full bg-[#E9D659]",
  },
];
export const stats = [
  { value: "24K+", label: "active learners" },
  { value: "120+", label: "expert-led courses" },
  { value: "92%", label: "complete their first course" },
];
export const footerColumns = [
  { title: "Explore", links: ["Courses", "Categories", "Instructors", "For Teams"] },
  { title: "Company", links: ["About", "Careers", "Journal"] },
  { title: "Support", links: ["Help Center", "Contact", "Terms", "Privacy"] },
];
// Social proof avatars: real photos (decorative, so alt stays empty) with initials kept as fallback.
const photoAvatar = (file: string, initials: string, color: string) => ({
  src: `/images/avatars/${file}`,
  alt: "",
  initials,
  color,
});

export const heroAvatars = [
  photoAvatar("avatar1.jpg", "MC", "bg-orange-300"),
  photoAvatar("avatar2.jpg", "AM", "bg-indigo-300"),
  photoAvatar("avatar3.jpg", "JS", "bg-emerald-300"),
];

// The closing section reuses the hero photos and adds one more face.
export const finalCtaAvatars = [...heroAvatars, photoAvatar("avatar5.jpg", "RM", "bg-rose-300")];

// People mosaic: 4 wrappers measured on the 530x522.44 Figma frame. Every size below is px inside
// that frame; PeopleMosaic turns them into percentages so the collage scales with the layout.
const photo = (file: string, alt: string, width: number, height: number, align: "left" | "center" | "right" = "left") => ({
  src: `/images/people/${file}`,
  alt,
  width,
  height,
  align,
});

export const mosaicColumns = [
  {
    // 2 photos
    width: 138.03,
    height: 438.17,
    paddingTop: 64.2,
    photos: [
      photo("1.jpg", "Smiling girl raising her hand in a classroom", 102.72, 154.08, "right"),
      photo("2.jpg", "Students and a teacher laughing around a table", 138.03, 207.05),
    ],
  },
  {
    // 3 photos
    width: 102.72,
    height: 522.44,
    paddingTop: 25.68,
    photos: [
      photo("3.jpg", "Young woman in a hooded robe reading a large book", 102.72, 170.13),
      photo("4.jpg", "Two women talking by a window next to a music stand", 102.72, 172.54),
      photo("5.jpg", "Student studying with a laptop and an open book", 102.72, 128.4),
    ],
  },
  {
    // 3 photos
    width: 102.72,
    height: 455.03,
    paddingTop: 0,
    photos: [
      photo("6.jpg", "Graduate in a cap and gown holding a red diploma", 102.72, 137.23),
      photo("7.jpg", "Woman working on a laptop at a desk at home", 102.72, 138.03),
      photo("8.jpg", "Teacher giving a lesson on a desktop monitor", 102.72, 154.08),
    ],
  },
  {
    // 2 photos
    width: 128.4,
    height: 349.9,
    paddingTop: 0,
    photos: [
      photo("9.jpg", "Smiling student with curly hair holding a red folder", 128.4, 204.64),
      photo("10.jpg", "Student in a hijab holding a coffee cup and books", 102.72, 132.42),
    ],
  },
];