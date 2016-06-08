
	<div class="header">
		<img src="images/logo.png" />
		<button type="button" class="drawer-toggle">Drawer toggle</button>
	</div>
	
	<nav class="drawer-nav" role="navigation">
      <ul class="drawer-menu">
        <li><img src="images/chris.jpg" /></li>
        <li>Chris White</li>
        <li><a class="drawer-menu-item" href="profile.html">Edit Profile</a></li>
        <li><a class="drawer-menu-item" href="history.html">History</a></li>
        <li><a class="drawer-menu-item" href="index.html">Check-In</a></li>
      </ul>
    </nav>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/iScroll/5.1.3/iscroll.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js"></script>
  <script src="js/drawer.min.js" charset="utf-8"></script>
  <script>
    $(document).ready(function() {
      $('.drawer').drawer();
    });
  </script>