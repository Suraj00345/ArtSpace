export default toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);

  // This toggles the 'dark' class on the <html> tag
  if (newTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};