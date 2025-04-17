function toggleMenu(btn) {
  const menu = document.getElementById("menu-options");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}
