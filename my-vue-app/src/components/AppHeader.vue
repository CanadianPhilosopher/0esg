<template>
    <header class="app-header">
      <div class="logo"> <img src="../assets/img_logo 1.svg" alt="OESG Logo" class="logo-image"> </div>
      <nav class="navigation">
        <button class="icon-button"> <img src="../assets/home-icon.svg" alt="Home"> </button>
        <button class="icon-button"> <img src="../assets/img-pen.svg" alt="Write"> </button>
        <button class="icon-button"><img src="../assets/img-bar.svg" alt="Data"> </button>
        <button class="icon-button"><img src="../assets/img-search.svg" alt="Search"> </button>
        <button class="icon-button"><img src="../assets/img-lonceng.svg" alt="Notification"> </button>
        <button class="icon-button"><img src="../assets/img-menu.svg" alt="Menu"> </button>
      </nav>
      <button class="login-button">Log In</button>
    </header>
  </template>
  
  <script setup>
  
  
  </script>
  
  <style scoped>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px ;
    background-color: #fff; /* Or your specific header background */
    border-bottom: 1px solid #eee;
    color: #333;
  }
  
  .logo {
    font-weight: bold;
    font-size: 1em;
    /* Add specific font/styling for OESG logo */
  }
  
  .navigation {
    display: flex;
    gap: 15px; /* Space between icons */
  }
  
  .icon-button {
    background: none;
    border: none;
    font-size: 1.2em; /* Adjust icon size */
    cursor: pointer;
    color: #555;
    padding: 5px;
  }
  
  .icon-button:hover {
    color: #000;
  }
  
  .login-button {
    padding: 8px 15px;
    background-color: #f0ad4e; /* Yellowish button */
    border: none;
    border-radius: 4px;
    color: #fff; /* White text often looks good on colored buttons */
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .login-button:hover {
    background-color: #ec971f; /* Darker yellow on hover */
    
  }
  
  /* Basic placeholder styling */
  .icon-button {
    font-family: monospace; /* Just to make placeholders look distinct */
    font-size: 1em;
    border: 1px dashed #ccc;
    padding: 2px 4px;
  }
  </style>