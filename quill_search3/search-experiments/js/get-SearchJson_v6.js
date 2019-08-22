

/*
This script is used in conjunction with an html page to return
search results by scraping the existing live production site
This uses the $.get function of Jquery and converting it to JSON
By using JSON we can then format the results into a variety of ways
including a list view, grid view, cards, and ribbons

if page cannot be parsed or CORS restriction prevents the access
then it will access saved html search result page files locally with no CORS restrictions
Static pages are pulled from local data-src1 directory

*/

// initialize some variables
var url = '';
var jsonContent = new Object();
var localData;
var filtersRes;

// get keywords from query string if any
var searchString = getQVar("keywords");

// get search box field elements
var doSearch = document.getElementById("doNewSearch");
var doSearchKey = document.getElementById("newSearch");

// add click event to search btn
doSearch.addEventListener("click", getSearch, false);

// add enter key to input box
doSearchKey.addEventListener("keyup", function (e) {
 if (e.keyCode == 13 ) {
  getSearch();
 }
});

// executes search without reloading whole page
function getSearch (event) {

  // set term to be something from searchbox or querystring
  var sTerms = "";

  sTerms = document.getElementById("newSearch").value;
  console.log("terms: ]" + sTerms + "[");

  var urlPrefix = "../search-experiments/data-src1/";

  searchTerms = sTerms.replace(" ", "-");
  // searchTerms = encodeURI(sTerms);
  url = urlPrefix + searchTerms + ".html";

  getHTML(url);

  $("#displaySearchTerms").text("Search Results for \"" + sTerms + "\"");
  $("#displayList").attr("keywords", searchTerms);

  // sets static image for the promo ribbon
  var promoPath = "../images/" + searchTerms + "-promo.png";
  $("#promo-img").attr("src",promoPath);
  return false;

}

// check if there are keywords on the url string
function getQVar(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// check for url or query string
if((url == '') && (!searchString)) {
  url = "../search-experiments/data-src1/copy-paper.html";

} else if (searchString != '') {

   // hyphenate the term so that we can use for the path
   var sTerms = searchString.replace("-", " ");

   // get local files
   if (searchString === "copy-paper") {
      url = "../search-experiments/data-src1/copy-paper.html";
   } else if (searchString === "laptops") {
      url = "../search-experiments/data-src1/laptops.html";
      $("#displayList").attr("keywords", searchString);
      $("#displaySearchTerms").text("Search Results for \"" + sTerms + "\"");
   }

   // this is a static image of promo products in a ribbon
   // need to replace with actual promo products (if any)
   var promoImgPath = "../images/" + searchString + "-promo.png";
   $("#promo-img").attr("src",promoImgPath);

} else {
  // main page is making the call
   url = "../search-experiments/data-src1/copy-paper.html";

}

// get html on initial page load
getHTML(url);

// this is called by the initial page load or by the search
function getHTML(url) {
    // this retrieves the page
    var getResults = $.get( url, function( results ) {
       // we are doing nothing here until we are sure the page is retrieved

    })
    .done(function(results) {


          // check if it has a results block
          var checkSearch = $("#SKUDetailsDiv", results).text();

          if ((checkSearch === "") || (checkSearch === undefined)) {

              // there were no search formatted results
              parseTheApi("");

              // what did we get
              console.log(results);

          } else {

              // builds the JSON so that we can then format it as needed for the layout
              buildSearchJSON(results);

              // this function gets implemented in parse json js file
              parseTheApi(jsonContent);

              $("#filtersCol").html(filtersRes);

              // this makes the filter headers sticky
              $(function() {
                stickyHeaders.load($(".NewSearchFilterLable"));
              });

          }
    })
    .fail(function(results) {
        // tell me what went wrong
         console.log(results);
         console.log(results.status);
         console.warn(results.response);
    });
}


// format content from html into a json
function buildSearchJSON(pageContent) {

  // start a new json object
  var resultRows = '{"products" : [\n';

  // we use the remove() function to pull out the chunk we need from the results
  // the each function loops through all the rows

  /* -------------------get the row by row results---------------------*/
  /* ------------------------------------------------------------------*/

  var searchRes = $("#SKUDetailsDiv", pageContent).remove().each(function ( i, innerRow ) {

      // initialize vars for all the product chunks for each row

      var prodDetLink = "";
      var imgPath = "";
      var skuID = "";
      var itemID = "";
      var itemTitle = "";
      var itemDesc = "";
      var itemPrice = [];
      var qtyTier = [];
      var tierSavings = [];
      var saveMsg = [];
      var uomTxt = "";
      var qtyLmt = "";
      var starRating = "";
      var reviewNum = "";
      var cartAdd = "";
      var wasPrice = "";
      var compLink = "";
      var highYield = "";
      var multiPack = "";
      var promoFlag = "";
      var quickShip = "";
      var ownBrand = "";
      var favLink = "";
      var compPrint = "";
      var itemLpo = "";
      // var thisSubscribe = "";



             // need to extract the item number
             prodDetLink = checkThis($(".Img_Sku", innerRow).attr('href'));


             imgPath = checkThis($("#SkuPageMainImg", innerRow).attr('src'));
                 if ((imgPath != '') && (imgPath != '/Images/shared/stardust.gif?v=mCLni2uxb7sYI1BUB4Di7A')) {
                 // load the result if it is not empty/undefined

                    // replace the img src so it loads when viewed locally (this is not needed on the server)
                    console.warn("img: " + imgPath);

                    imgPath = "https:" + imgPath;

                // we have to find the images that are being lazy loaded
                 } else if (imgPath == '/Images/shared/stardust.gif?v=mCLni2uxb7sYI1BUB4Di7A') {
                   // the image path is in the data-src instead
                    imgPath = checkThis($("#SkuPageMainImg", innerRow).attr('data-src'));
                    imgPath = "https:" + imgPath;
                 } else {
                   // empty image
                   // we should put an image not available here

                 }

             // need to extract the item number
             skuID = checkThis($(".Img_Sku", innerRow).attr('sku'));

             // need to extract the item number
             itemID = $(".iNumber", innerRow).remove().html().split("# ");

             itemID = checkThis(itemID[1]);

             // get prod title - need to trim and escape any double quotes
             itemTitle = checkThis($("#skuName a", innerRow).text());


             // get sku bullets
             var bulletDesc = $(".skuBrowseBullet", innerRow).each(function (v, bullets) {
                 //console.log("bullets: " + bullets);
                 itemDesc += '"bullet' + v + '" : "' + checkThis($(bullets).text().replace(/[\n\r]/g, "")) + '",\n'
              });

             itemDesc = itemDesc.slice(0,-2) + '\n';

             // get uom
             uomTxt = checkThis($(".UOM", innerRow).html());

             // get sku ratings
             starRating = checkThis($("#productRating", innerRow).html());

             // get review count
             reviewNum = checkThis($("span[itemprop=reviewCount]", innerRow).html());


             // ink and toner flags
             highYield = checkThis($(".IcoHighYield", innerRow).attr("title"));
                    highYield = '"highYield":"' + highYield +'",\n';

             multiPack = checkThis($(".IcoMultiPack", innerRow).attr("title"));
                    multiPack = '"multiPack":"' + multiPack + '",\n';

             // get sku main promoImg
             promoFlag = checkThis($(".promoImage img", innerRow).attr("src"));
             if (promoFlag != "") {
                    // load the result
                    // rewrite the image path to work locally (not needed on the server)
                promoFlag = promoFlag.replace('/Images', 'https://www.quill.com/Images');
                promoFlag = '"promoFlagPath":"' + promoFlag + '"\n';

              } else {
                promoFlag = '"promoFlagPath":""\n';
              }


             // get ink and toner yeild and pack flags



             // get quick delivery
             // in the live site this image is displayed using CSS background to the following image
             // https://www.quill.com/Images/shared/quick_ship.png
             // so we are just going to indicate yes/no for quick ship
             // we are just checking if there is any content in the div
             // we should also get the tooltip info but we can easily recreate in a new design
             quickShip = checkThis($(".quickShip", innerRow).html());
                 if ((quickShip != undefined) && (quickShip != "")) {
                   // wrap the delivery
                   quickShip = "y";
                 } else {
                   quickShip = "n";
                 }


             // get lifetime block
             // same as quickship we are checking if the block has any content
             // we should also get the tooltip info but we can easily recreate in a new design
             ownBrand = checkThis($(".ownBrand", innerRow).html());
                 if ((ownBrand != undefined) && (ownBrand != "")) {
                   // wrap the delivery
                   ownBrand = "y";
                 } else {
                   ownBrand = "n";
                 }


             // get fav list
             // like the other meta data we can either use or replace
             favLink = checkThis($("#lbAddToFavorites1", innerRow).attr("href"));


             // get the onclick compare link
             // we can re-use or replace depending on the project
             // need to build the compare checkboxID
             var compareID = "#CChckBx" + skuID;
             compLink = checkThis($(compareID, innerRow).attr("onclick"));


             // get top savings story
             var thisWasPrice = checkThis($(".savingStory", innerRow).html());
              if (thisWasPrice != "") {
                   // rewrite the savings story to one line
                   var wasPrice = $(".strike", this.innerHTML).remove().text();

                   var savedAmt = checkThis($(".savingStory .green", innerRow).text());
                   console.log("svAmt: " + savedAmt);

              } else {
                   var wasPrice = "";
                   var savedAmt = "";
              }


             // get qty Limit quantitylmt
             qtyLmt = checkThis($(".quantitylmt", innerRow).html());
                 if (qtyLmt != undefined) {
                    qtyLmt = qtyLmt;
                 } else {
                    qtyLmt = '';
                 }


            // get the compatible printers onclick attribute
            // we can use or replce in a prototype
             compatPrint = checkThis($("#hypCompatiblePrinters", innerRow).attr("onclick"));
                 if (compatPrint != '') {
                    // load the result
                    compatPrint = compatPrint;
                 } else {
                    compatPrint = "";
                 }

              // get LPO link - .ownBrandSuggestionLink

             var lpoID = "#obAlsoConsider" + skuID;
             itemLpo = checkThis($(lpoID, innerRow).attr("onclick"));
                 if (itemLpo != '') {
                    // load the result
                    itemLpo = itemLpo;
                 } else {
                    itemLpo = "";
                 }


             // get singleton price
              var itemPrice2 = checkThis($("#SkuPriceUpdate", innerRow).html());
                 if (itemPrice2 != "") {
                    // start clean
                  var priceRows = "";

                   // tier starts at 1
                   var topTier = "1";

                   priceRows += '{\n';
                           priceRows += '"tierNum":"' + topTier + '",\n';
                           priceRows += '"tierWasPrice":"' + wasPrice + '",\n';
                           priceRows += '"tierPrice":"' + itemPrice2 + '",\n'
                           priceRows += '"tierQtyLmt":"' + qtyLmt + '"\n';
                   priceRows += '}\n';

                 }

             // console.log("price: " + priceRows);

             // get pricing table if any and override single price
            var thisPtable2 = checkThis($(".purBreak", innerRow).html());
            if( thisPtable2 != "") {

              // reset the table rows
              priceRows = "";

              // get the number of tds to tell us how many tiers there are
              var tdCount2 = $("tr", thisPtable2).children("td").length;

              //console.log("td count: " + tdCount2);

               // set count defaults for  2 tiers (9 tds)
               var qCount = 2;
               var sCount = 8;
               var pCount = 5;

               if (tdCount2 == 12) {
                   qCount = 3;
                   sCount = 11;
                   pCount = 7;

                } else if (tdCount2 == 15) {
                   qCount = 4;
                   sCount = 14;
                   pCount = 9;

                } else if (tdCount2 == 18) {
                   qCount = 5;
                   sCount = 17;
                   pCount = 11;

                }

               var qtyTier2 = [];
               var priceTier2 = [];
               var saveTier2 = [];

               for (z=(qCount-1); z >= 0; z--) {
                   qtyTier2[z] = $("tr", thisPtable2).children("td").eq(qCount).text().trim();
                   saveTier2[z] = $("tr", thisPtable2).children("td").eq(sCount).text().trim();
                   priceTier2[z] = $("tr", thisPtable2).children("td").eq(pCount).text().trim();


                   qCount--;
                   sCount--;
                   pCount--;

                   // put everything into a new array
                   if (z == (qtyTier2.length-1)) {
                    priceTier2[z] = priceTier2[z];
                   }

                   if ((z == (qtyTier2.length-1)) && (wasPrice != "")) {
                      saveTier2[z] = "was <span class='strike'>" + wasPrice + "</span>";
                   } else if (saveTier2[z] != "") {
                      saveTier2[z] = "save " +saveTier2[z];
                   }

                   priceRows += '{\n';
                           priceRows += '"tierNum":"' + qtyTier2[z] + '",\n';
                           priceRows += '"tierWasPrice":"' + saveTier2[z] + '",\n';
                           priceRows += '"tierPrice":"' + priceTier2[z] + '",\n'
                           priceRows += '"tierQtyLmt":"' + qtyLmt + '"\n';
                   priceRows += '},';

                   // clear the save price
                   wasPrice = "";


               }

             }

             // remove the last comma
             priceRows = priceRows.slice(0,-1);
   /* -----------------------------------------------------*/
   /* --------------------- output rows -------------------*/
   /* -----------------------------------------------------*/
   /* -----------------------------------------------------*/


   // we will push the vars into an array block for each row
    resultRows += '     {\n';
        resultRows += '          "prodLink":"' + prodDetLink + '",\n';
        resultRows += '          "skuImgPath":"' + imgPath + '",\n';
        resultRows += '          "skuID":"' + skuID + '",\n';
        resultRows += '          "itemID":"' + itemID + '",\n';
        resultRows += '          "prodTitle":"' + itemTitle + '",\n';
        resultRows += '          "prodDesc": {\n' + itemDesc + '\n},\n';
        resultRows += '          "priceTiers": [\n' + priceRows + '\n],\n';
        resultRows += '          "priceSvgs":"' + savedAmt + '",\n';
        resultRows += '          "uomTxt":"' + uomTxt + '",\n';
        resultRows += '          "quantLimit":"' + qtyLmt + '",\n';
        resultRows += '          "starRating":"' + starRating + '",\n';
        resultRows += '          "reviewNum":"' + reviewNum + '",\n';
        resultRows += '          "compareOnclick":"' + compLink + '",\n';
        resultRows += '          "promoFlags": {\n' + highYield + multiPack + promoFlag + '},\n';
        resultRows += '          "quickShip":"' + quickShip + '",\n';
        resultRows += '          "lifeTime":"' + ownBrand + '",\n';
        resultRows += '          "favPath":"' + favLink + '",\n';
        resultRows += '          "compatPrint":"' + compatPrint + '",\n';
        resultRows += '          "lpoOnclick":"' + itemLpo + '"\n';
    // end result row
    resultRows += '     },\n';

     // console.log("srchResLgth: " + i);


     }); // end get search results

    // remove the trailing space and comma
    resultRows = resultRows.slice(0, -2);

    // close the overall json prod obj array
    resultRows += '\n   ]\n}';

    // assign the results to a var as we can not simply return
    jsonContent = resultRows;

    // get the filters
    filtersRes = "<h4>Filter the Results</h4>";

    // this grabs the whole column of filters
    var filterBlob = $("#GuidedNavFilters", pageContent).html();

    //rewrite the image path for the quick ship filter
    var quickShipRep = filterBlob.replace('/Images/Quill/Shared/QuickShip.png', '../images/icons/quick-ship-icn-gray1.svg');
    filtersRes += quickShipRep;


} // end scrape page

// this ensures that the value exists and any html chunks with quoted attributes will not break the json
function checkThis (thisVal) {
  // checks if the value exists or is empty
   if ((thisVal != undefined) && (thisVal != "")) {
      // escape the quotemarks so the json does not break
      thisVal = thisVal.trim().replace(/\"/g,'\\"');
      thisVal = thisVal.trim().replace(/\\'/g,"\\\\'");
      return thisVal;
   } else {
     // return empty content
      return '';
   }
}
