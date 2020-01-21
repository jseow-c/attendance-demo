export const listVariants = {
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

export const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const modalVariant = {
  hidden: {
    height: ["calc(100% - 4.75rem)", "calc(90% - 4.275rem)", "calc(0% - 0px)"],
    padding: ["7vmin 5.5vmin", "0vmin 0vmin", "0vmin 0vmin"],
    transition: {
      duration: 0.2,
      times: [0, 0.1, 1],
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  visible: {
    height: ["calc(0% - 0px)", "calc(90% - 4.275rem)", "calc(100% - 4.75rem)"],
    padding: ["0vmin 0vmin", "0vmin 0vmin", "7vmin 5.5vmin"],
    transition: {
      duration: 0.2,
      times: [0, 0.9, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const modalChildVariant = {
  hidden: {
    opacity: 0,
    transition: { duration: 0 }
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  }
};
