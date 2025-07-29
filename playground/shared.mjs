
export async function getSpyxx() {
  while (true) {
    if (!window.spyXX) {
      await delay();
    } else {
      return window.spyXX;
    }
  }
}

export function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
}