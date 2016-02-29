<html>
<head>
    <title>rolling divs</title>
<style>
@-webkit-keyframes roll {
    0% {left: 1%; }
    100% {left: 90%;}
    }
 
.ball {
    position:absolute; left: 3px;
    height:50px; width:50px; border-radius:25px;
    -webkit-animation-name: roll;
    -webkit-animation-duration: 2s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-play-state: paused;
    }
</style>
 
<script type="text/javascript">
function goAway(event) {
    event.target.style.display="none";
    }
</script>
 
</head>
<body onload="document.body.addEventListener('webkitAnimationEnd', goAway, false);">
Click the colored balls to make them roll away:
<div class="ball"
     style="top:50px; background-color: red;"
     onclick="this.style.webkitAnimationPlayState = 'running';">
</div>
<div class="ball"
     style="top:105px; background-color: green;"
     onclick="this.style.webkitAnimationPlayState = 'running';">
</div>
<div class="ball"
     style="top:160px; background-color: blue;"
     onclick="this.style.webkitAnimationPlayState = 'running';">
</div>
</body>
</html>
