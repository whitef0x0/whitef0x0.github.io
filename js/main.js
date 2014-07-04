colors = ['#B118AB', 
          '#56264D', 
          '#3A0122', 
          '#422172', 
          '#9a5305', 
          '#3677c7', 
          '#0d1d35', 
          '#2b0111', 
          '#082626', 
          '#0e1a4a', 
          '#190a0f', 
          '#15111b', 
          '#472942', 
          '#860b04', 
          '#552939', 
          '#07211a', 
          '#761634', 
          '#440139', 
          '#3c600a', 
          '#360a09', 
          '#2a3628'];

// Document ready
$(function() {

  // Set a timeout...
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);

  // initialize Parse
  Parse.initialize("RsI9Hn7jETLPOpYv20gfdN6MaIB1MkEsIs26zqih", "ettyekyxh6UtHnColhHgS5vTZ87Dtqw1PsijHiU0");

  // scroll the window back to the top
  // $('html, body').scrollTop(0);

  // set the upload trigger on the button
  $("#faq-see-more").on('click', function(e) {
    $('#faq-pane').toggleClass('faq-rolled');
    mixpanel.track('page_interaction', {
      referrer: document.referrer,
      type: "faq-see-more",
      href: "#"
    });
    $('#faq-pane').css('max-height', '1900px');
    viewportUnitsBuggyfill.refresh();
    e.preventDefault();
  });

  // Reset the logo for drawing
  $('.logo-animated path').each(function() {
    resetPathDrawing(this);
  });

  // Detect if the current browser is Firefox, and if it is,
  // use the much less cool version of this animation which
  // looks exactly the same.
  // In case you're curious: we had to make two methods to
  // scale the dots because Safari (and probably others)
  // don't let you set the radius (claiming it is read-only).
  if (typeof InstallTrigger !== 'undefined') {
    $('.logo-animated circle').each(function() {
      var t = $(this);
      t.attr('len', t.attr('r'));
      t.attr('r', '0');
      t.attr('class', '');
    });
  }

  // enable smooth scrolling to anchors
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        if ($('.collapse.navbar-collapse').hasClass('in')) $('.navbar-toggle').click();
        
        $('html,body').animate({
          scrollTop: target.offset().top - getNavOffset()
        }, 400);
        return false;
      }
    }
  });

  // affix the navbar, and
  // fix the width when resized
  $(window).resize(fixNavWidth);
  fixNavWidth();
  if (jQuery.browser.mobile) $('#logo-wrapper').css('max-height', $('#logo-wrapper').height());
  // so the page doesn't jump around later...
  $('#logo-wrapper').css('min-height', $('#anchor-greeting').height());

  // pick a random background
  var img = Math.floor(Math.random() * 21) + 1;
  colorify(colors[img-1]);
  var bg = '/img/poly/' + img +'.jpg';
  $('<img/>').attr('src', bg).load(function() {
    $(this).remove(); // prevent memory leaks as @benweet suggested
    $('body').css('background-image', 'url(' + bg + ')');
    $('#main-container').removeClass('transparent');
    $('#loading-curtain').addClass('transparent');
    setTimeout(function() {
      // $('#loading-curtain').css('display', 'none');
    }, 650);

    // The path has been reset, so show the div
    $('#logo-wrapper').removeClass('invisible');
    viewportUnitsBuggyfill.refresh();
    // start the logo animation in 500ms
    runLogoAnimation(1000);
    });

  // initialize the schools list with typeahead
  var schools = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('foo'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 5,
    prefetch: {
      ttl: 0,
      thumbprint: "blah",
      url: '/json/universities.json',
      filter: function(list) {
        return $.map(list, function(uni) { return { foo: uni }; });
      }
    }
  });
  schools.initialize();
  $('#school').typeahead({
    hint: false
  }, {
    displayKey: 'foo',
    source: schools.ttAdapter()
  });

  viewportUnitsBuggyfill.refresh();
});


// FOO

function colorify(color) {
  $('.colorified').css('background-color', color);
}

function runLogoAnimation(delay) {
  // Drag the elements of the logo in 300ms from load
  window.setTimeout(function() {
    $('#background-wrapper').removeClass('transparent');
    $('.logo-animated circle').attr('class', 'grow-animated');
    // this fixes the circles on firefox
    if (typeof InstallTrigger !== 'undefined') {
      $('.logo-animated circle').each(function() {
        var t = $(this);
        TweenMax.set(t, 1, {scale: 1, transformOrigin: "50% 50% 0"});
        TweenMax.to(t, 1, { attr:{ r: t.attr('len') } });
      });
    }
  }, 300 + delay);

  // Then, 100ms later, start drawing the lines
  window.setTimeout(function() {
    $('.logo-animated path').each(function() {
      simulatePathDrawing(this, 4.4);
    });
    // The border needs to be drawn more quickly
    simulatePathDrawing($('#logo-outline-path')[0], 3.0);
  }, 400 + delay);
}

function fixNavWidth() {
  // $('body').css('height', $('#fixed-footer').offset().top - $('#fixed-header').offset().top);
  $('nav').affix({
    offset: {
      top: function() { return $('#main-container').offset().top }
    }
  });
  var offset = getNavOffset();
  $('section#faq').css('margin-top', offset + "px")
  $('#main-container').css('margin-top', "-" + offset + "px");
  $('#main-nav').width($('#main-container').outerWidth());
  viewportUnitsBuggyfill.refresh();
}

function getNavOffset() {
  // return $('#main-nav').innerHeight() + $('.navbar-header').innerHeight();
  var offset = 0;
  if ($('.navbar-header').height() === 0)
    offset = $('#main-nav').height();
  else offset = $('.navbar-header').height();
  return offset;
}

function validateEmail(email) {
  // jk I typed it out
  var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
  return re.test(email);
  // ...not
}

function daysBetween(date1, date2) {
  var oneDay = 24*60*60*1000;
  console.log(date1.getTime());
  console.log(date2.getTime());
  return Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));
}

// Reset the drawing before starting
function resetPathDrawing(path) {
  // we need to hardcode the lengths because of Firefox
  length = $(path).attr('length');
  // Clear any previous transition
  path.style.transition = path.style.WebkitTransition = path.style.MozTransition = 
  'none';
  // Set up the starting positions
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  return length;
};

// For drawing the MHacks logo
function simulatePathDrawing(path, duration) {
  // grab the original values
  strokeDashoffset = path.style.getPropertyValue('stroke-dash-offset');
  strokeWidth = path.style.getPropertyValue('stroke-width');
  fill = path.style.getPropertyValue('fill');
  
  // do the stuff
  var length = resetPathDrawing(path);
  path.getBoundingClientRect();
  // Define our transition
  path.style.transition = path.style.WebkitTransition = path.style.MozTransition =
  'all ' + duration + 's ease-in';
  // Go!
  path.style.strokeDashoffset = strokeDashoffset;
  path.style.strokeWidth = strokeWidth;
  path.style.fill = fill;
};
