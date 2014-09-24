(function($) {
    
  /*
    --------------
    --------------
    View Constants
    --------------
    --------------
  */
  
  var CURRENT_PRODUCT     = null;
  var CURRENT_STORENAME   = null;
  var AVAILABILITY        = null;
  var CURRENT_PARTS       = {};
  var TIME_DATA           = {};
      TIME_DATA.DATE      = null,
      TIME_DATA.TIME      = null,
      TIME_DATA.TIMEZONE  = null;

  RPData.$noErrorContent = $('.two-col-container, .dropdown-container, .disclaimer-container'),
  RPData.template        = 'check_availability';

  /*
    -------------------------------------
    -------------------------------------
    Initial View Config - Setup Templates
    -------------------------------------
    -------------------------------------
  */

  $('#productheader').append(_.template(JST['check_availability_header'], RPData));
  $(".disclaimer-container").append(_.template(JST["check_availability_disclaimer_container"], RPData));
  $(".loading-container").append(JST["check_availability_loading"]);
  
  $(document).ready(function() {  // wait for globalfooter to be loaded
    RPData.$loadedContent = $('#productheader,#globalfooter,.disclaimer-container,.two-col-container,.error-container');
    retina("#productheader,.loading-container,#globalfooter");
    showLoader();
  });

  $.ajax({
    url: "availability.json",
    type: "GET",
    timeout: RPData.errorTimeoutTime,
    dataType: "JSON",
    success: function(response) {
      if(response) {        
        setupBaseView(response);
      } else {
        showErrorView();
      }
    },
    error: function() {
      showErrorView();
    }    
  });
  
  /*
    -----------------
    -----------------
    jQuery DOM Events
    -----------------
    -----------------
  */

  function setupDOMEvents() {
    $("select[name=products]").on("change", function(el) {
      
      // assign product to CURRENT_PRODUCT using selected index
      CURRENT_PRODUCT = RPData.products[$(el.currentTarget).find(":selected").data("index")];
      // reset selected part numbers for product
      if(CURRENT_PRODUCT) {
        resetParts(CURRENT_PRODUCT.sizes);
      }
    });

    $("select[name=stores]").on("change", function(el) {
      CURRENT_STORENAME = $(el.currentTarget).find(":selected").text();
    });
    
    $("select[name=stores], select[name=products]").on("change", function(el) {
      var storeSelected  = $("select[name=stores]").find(":selected").val();

      if (storeSelected && CURRENT_PRODUCT) {
        resetParts(CURRENT_PRODUCT.sizes);
        setupResults(AVAILABILITY[storeSelected]);
        
      } else {
        
        // return if required selections are missing
        return false;
      }
      
    });
  }  
  
  /*
    ---------------------
    ---------------------
    Custom View Functions
    ---------------------
    ---------------------
  */
  
  function setupBaseView(response) {
    // Set the availability constant
    AVAILABILITY = response;

    $('.availability-title-container').append(_.template(JST['check_availability_availability_title_container'], RPData));
    $(".storeselect.products").append(_.template(JST["check_availability_product_select_container"], RPData));
    $(".storeselect.stores").append(_.template(JST["check_availability_store_select_container"], RPData));
    $('.select-style').css('background-image', 'url(' + __language__['iReserve.selectArrowImage'] + ')');

    // add products to select container
    _.each(RPData.products, function(item, index) {
      $("select[name=products]").append("<option data-index="+ index +">"+ item.localizedName +"</option>");
    });

    retina('.two-col-container');

    // fetch stores after container is in DOM
    fetchStores();
    // setup DOM events after elements have loaded
    setupDOMEvents();
  }

  function fetchStores() {
  
    // Fetch list with store data
    $.ajax({
      url: "stores.json",
      type: "GET",
      timeout: RPData.errorTimeoutTime,
      dataType: "JSON",
      success: function(response) {
        if(response && !isEmpty(response)) {        
          setupStores(response);
        } else {
          showErrorView();
        }
      },
      error: function(jqXHR, status, error) {
        console.log(error);
        showErrorView();
      }
    });
  }
    
  function setupResults(response) {
    if (response == undefined) { return; }
    
    // determine available part numbers from response
    determineAvailablePartNumbers(response);
    // create object with availability info for JSTemplate
    var availableInfo = { 
      "date"     : TIME_DATA.DATE, 
      "time"     : TIME_DATA.TIME, 
      "timezone" : TIME_DATA.TIMEZONE, 
      "product"  : CURRENT_PRODUCT.localizedName,
      "storeName" : CURRENT_STORENAME
    };

    // clear results container, add date,
    // setup device family container
    $(".results-container")
      .html('')
      .prepend(_.template(JST["check_availability_date"], availableInfo))
      .append(JST["check_availability_device_family"])
      .append(_.template(JST["check_availability_get_started_container"], RPData));

    // set col layout based on available product sizes
    // must come after device_family template is in DOM
    switch(CURRENT_PRODUCT.sizes.length) {
    case 2:
      $(".device-sizes").addClass("two-col");
      break;
    case 3:
      $(".device-sizes").addClass("three-col");
      break;
    case 4:
      $(".device-sizes").addClass("four-col");
      break;
    }

    // sort device sizes by value from JSON
    // size value looks at number within string
    CURRENT_PRODUCT.sizes = CURRENT_PRODUCT.sizes.sort(function(a, b) {
      if (parseInt(a.size) < parseInt(b.size))
        return -1;
      if (parseInt(a.size) > parseInt(b.size))
        return 1;
      return 0;
    });
    // add size columns to results container 
    _.each(CURRENT_PRODUCT.sizes, function(size, index) {

      $(".device-sizes thead tr").append(_.template(JST["check_availability_sizes"], size));

      // add colors to size columns
      _.each(size.colors, function(color){
        color.size = size.size;
        color.colorSortOrder = color.colorSortOrder || '';
        
        if (typeof color.colorSwatchUrl !== 'undefined'){
          color.colorSwatchUrl = correctImageSizeUrl(color.colorSwatchUrl, {width:RPData.availabilitySwatchImageWidth,height:RPData.availabilitySwatchImageHeight});
        }
        if (typeof color.colorSwatchUrl2x !== 'undefined'){
          color.colorSwatchUrl2x = correctImageSizeUrl(color.colorSwatchUrl2x, {width:RPData.availabilitySwatchImageWidth*2,height:RPData.availabilitySwatchImageHeight*2});
        }

        var colorClass = color.name.toLowerCase().replace(' ', '-');
        if ($(".device-sizes ." + colorClass).length == 0){
          $($(".device-sizes tbody")).append(_.template(JST["check_availability_color"], color));
        }

        // check if availability text exists for this color & size
        var existingAvailText = $(".device-sizes ." + colorClass + " ." + color.size);
        if (existingAvailText.length){

          // if existing text is unavailable, remove it and replace with next availability
          if (existingAvailText.children("span").text() === __language__['iReserve.availability.unavailable.Message']){
            // remove & replace
            existingAvailText.remove();
            // append avail text for color & size
            $($(".device-sizes ." + colorClass)).append(_.template(JST["check_availability_color_available"], color));
          }
        }
        else {
          // append avail text for color & size
          $($(".device-sizes ." + colorClass)).append(_.template(JST["check_availability_color_available"], color));
        }

      });
    }); 

    _.each(CURRENT_PRODUCT.sizes, function(size, index) {
      // add empty missing color availability to size columns
      $('.device-sizes tbody tr').each(function(){
        if ($(this).find('.' + size.size).length === 0){
          $(this).append(_.template(JST["check_availability_color_available_empty"], size));
        }
      });
    });

    // sort color availability by size
    $('.device-sizes tbody tr').each(function(){
      $(this).find('.isAvailableText').parent().sortElements(function(a, b){
        return parseInt($(a).attr('class')) > parseInt($(b).attr('class')) ? 1 : -1;
      });
    });

    // sort rows by color sort order
    $('.device-sizes tbody tr').sortElements(function(a, b){
      var a_sort = parseInt($(a).attr('data-sort')),
          b_sort = parseInt($(b).attr('data-sort'));
      a_sort = isNaN(a_sort) ? Infinity : a_sort;
      b_sort = isNaN(a_sort) ? Infinity : b_sort;
      return a_sort > b_sort ? 1 : -1;
    });

    $('.skip-container').fancyFixed({'top': 184, 'wrap': '<div class="sticky-skip-container"/>'});

    $(".dropdown-container").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
    function(e) {
      $('.skip-container').data('fancyFixed').reposition();
    });

    $('.skip-container').data('fancyFixed').forceFixed();

    // Show Availability date/time info
    $(".dropdown-container").removeClass("hidden");

    // add bgimage for link arrow
    $('a.more, em.more, span.more').css('background-image', 'url(' + __language__['iReserve.linkArrowImage'] + ')');

  }
  
  function determineAvailablePartNumbers(response) {
      
    // iterate over part numbers from POST response
    // and determine its availability. Set available
    // value of CURRENT_PARTS[key]["available"] from 
    // response data.
    _.each(response, function(product, key){
      if(CURRENT_PARTS[key] && product) {
        CURRENT_PARTS[key]["available"] = true;
      }
      
    });
  }
  
  function setupStores(response) {
    TIME_DATA.DATE      = response.updatedDate,
    TIME_DATA.TIME      = response.updatedTime,
    TIME_DATA.TIMEZONE  = response.timezone;
    // add stores to select container
    _.each(response.stores, function(store) {
      $("select[name=stores]").append(_.template(JST["check_availability_option"], store));
    });    

    RPData.linkURL = response.reservationURL;

    if (__language__['iReserve.productSelection.smsEnabled']){
      $(".skip-container").append(_.template(JST["check_availability_skip_container_sms"], RPData));
    }
    else {
      $(".skip-container").append(_.template(JST["check_availability_skip_container"], RPData));
    }

    hideLoader();
    retina(".skip-container");

  }


  function resetParts(sizes) {
    // reset CURRENT_PARTS on change of product selection
    CURRENT_PARTS = {};
    
    // iterate over a selected products available sizes
    _.each(sizes, function(size) {
      
      // iterate over the colors for each size
      _.each(size.colors, function(color){
        
        // set color value on CURRENT_PARTS using partNumber as key
        CURRENT_PARTS[color.partNumber] = color;
        
        // make availability false by default
        CURRENT_PARTS[color.partNumber]["available"] = false;
      });
    });
  }

  function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
  }

})(jQuery)

