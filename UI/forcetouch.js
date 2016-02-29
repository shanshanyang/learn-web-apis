function prepareForForceClick(event)
{
  // Cancel the system's default behavior
  event.preventDefault()
  // Perform any other operations in preparation for a force click
}
 
function enterForceClick(event)
{
  // Perform operations in response to entering force click
}
 
function endForceClick(event)
{
  // Perform operations in response to exiting force click
}
 
function forceChanged(event)
{
  // Perform operations in response to changes in force
}
 
function setupForceClickBehavior(someElement)
{
  // Attach event listeners in preparation for responding to force clicks
  someElement.addEventListener("webkitmouseforcewillbegin", prepareForForceClick, false);
  someElement.addEventListener("webkitmouseforcedown", enterForceClick, false);
  someElement.addEventListener("webkitmouseforceup", endForceClick, false);
  someElement.addEventListener("webkitmouseforcechanged", forceChanged, false);
}

function getEventData(event)
{
  // Check to see if the event has a force property
  if ("webkitForce" in event)
  {
    // Retrieve the force level
    var forceLevel = event["webkitForce"];
 
    // Retrieve the force thresholds for click and force click
    var clickForce = MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN;
    var forceClickForce = MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;
 
    // Check for force level within the range of a normal click
    if (forceLevel >= clickForce && forceLevel < forceClickForce)
      // Perform operations in response to a normal click
 
      // Check for force level within the range of a force click
    } else if (forceLevel >= forceClickForce) {
      // Perform operations in response to a force click
    }
  }
}
