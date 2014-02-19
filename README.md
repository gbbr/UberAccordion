UberAccordion
=============

jQuery Accordion Plug-in (fluid and responsive)
Supported browsers: FireFox, Chrome, Safari, IE8+

Example
---------------

Below is a minimal example of setting up an accordion.

### HTML

```html
<div class="accordionContainer">
  <ul>
    <li>
      <h1 class="title">Slide One</h1>
      <div class="content">
        Content for slide one is rendered from here.
      </div>
    </li>
    
    <li>
      <h1 class="title">Slide Two</h1>
      <div class="content">
        Content for slide two is rendered from here.
      </div>
    </li>
    
    <li>
      <h1 class="title">Slide Three</h1>
      <div class="content">
        Content for slide three is rendered from here.
      </div>
    </li>
  </ul>
</div>
```

### JavaScript

```javascript
  $('.accordionContainer').uberAccordion({
    headerClass: 'title',
    contentClass: 'content' 
  });
```

`headerClass` and `contentClass` are optional parameters. By default, the header will be identified as `h1` and the content as the neighbouring `div`

Configuration
-------------

<table>
  <tr>
    <th>Option</th><th>Default</th><th>Description</th>
  </tr>
  <tr>
    <td>activeSlideClass</td><td>active</td><td>Name of the class to be added to the list element that represents the active slide</td>
  </tr>
  <tr>
    <td>orientation</td><td>horizontal</td><td>Can be "vertical" or "horizontal"</td>
  </tr>
  <tr>
    <td>orientationQuery</td><td>null</td><td>Media query that triggers orientation change. Example: { max-width: 300px; }</td>
  </tr>
  <tr>
    <td>verticalClass</td><td>accordion-vertical</td><td>Class to be added when orientation is vertical.</td>
  </tr>
  <tr>
    <td>horizontalClass</td><td>accordion-horizontal</td><td>Class to be added when orientation is horizontal.</td>
  </tr>
  <tr>
    <td>startSlide</td><td>1</td><td>Opens this slide when accordion is loaded.</td>
  </tr>
  <tr>
    <td>openMultiple</td><td>false</td><td>Allows multiple slides to be open at a time.</td>
  </tr>
  <tr>
    <td>autoPlay</td><td>false</td><td>Set auto-play to "true"</td>
  </tr>
  <tr>
    <td>autoPlaySpeed</td><td>5000</td><td>Speed of auto-play. Defaults to 5 seconds.</td>
  </tr>
  <tr>
    <td>slideEvent</td><td>click</td><td>Event that triggers opening the slides. Default is 'click'</td>
  </tr>
  <tr>
    <td>animationSpeed</td><td>200</td><td>Animation speed of opening the slides.</td>
  </tr>
  <tr>
    <td>headerClass</td><td><i>undefined</i></td><td><b>Optional</b> Defines the class of the header item. By default, the script will look for an h1 element. This can be used when a different kind of mark-up set-up is desired.</td>
  </tr>
  <tr>
    <td>contentClass</td><td><i>undefined</i></td><td><b>Optional</b> Defines the class of the content item. Same as above.</td>
  </tr>
</table>
