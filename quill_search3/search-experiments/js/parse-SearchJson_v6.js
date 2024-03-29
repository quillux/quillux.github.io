
// this formats the json into the html output for the page
function parseTheApi(myJson) {

      if ((myJson != "") && (myJson != undefined)) {

        //$("#jsonResults").html(myJson);

        var prodObj = JSON.parse(myJson);
        //var prodChunk = prodObj.products[b];

        var productResults = "";


        // loop through all the product matches
        for (b=0;b < prodObj.products.length; b++) {

          // start a new div block
          productResults += '<div class="search-grid-block">';

          // compare
            productResults += '<span class="compareCheckBlock"><label for="compare' + b + '">Compare</label><input type="checkbox" id="compare' + b + '" class="compareCheck"></span>';

            // promo flag
            if (prodObj.products[b].promoFlags.promoFlagPath != "") {

              var promoImgPath = prodObj.products[b].promoFlags.promoFlagPath;
              var promoClass, promoText;

              if(promoImgPath.indexOf("sale") > 0) {
                 promoClass = "saleFlag";
                 promoText = "Sale";
              } else if(promoImgPath.indexOf("bestprice") > 0) {
                promoClass = "bestPriceFlag";
                promoText = "Top Seller<br />Best Price";
              } else if(promoImgPath.indexOf("event2") > 0) {
                promoClass = "sale4Flag";
                promoText = "$4 Sale";
              } else if(promoImgPath.indexOf("closeout") > 0) {
                promoClass = "clearanceFlag";
                promoText = "Clearance";
              } else if(promoImgPath.indexOf("free") > 0) {
                promoClass = "specialFlag";
                promoText = "Special Offer";
              } else if(promoImgPath.indexOf("quillplus") > 0) {
                promoClass = "qpFlag";
                promoText = "Quill<b>PLUS</b>";
              } else if(promoImgPath.indexOf("private") > 0) {
                promoClass = "privateFlag";
                promoText = "Private Sale";
              }


               productResults += '<div class="promoFlag ' + promoClass + '">' + promoText + '</div>';
            }

            // need to get ink toner flags

          // image
            productResults += '<a class="imgLink" href="https://www.quill.com' + prodObj.products[b].prodLink + '">';
            productResults += '<img src="' + prodObj.products[b].skuImgPath + '" class="skuImg" />';
            productResults += '</a>';

          productResults += '<div class="prodInfoWrap">';
          // content
            productResults += '<a class="titleLink" href="https://www.quill.com' + prodObj.products[b].prodLink + '">';
            productResults += '<h4 class="prodTitle">' + prodObj.products[b].prodTitle + '</h4>';
            productResults += '</a>';

            // star ratings / reviews
            productResults += '<span class="itemNum">' + prodObj.products[b].itemID + '';
            // need to round the star rating and set a class
            var stars = (Math.round(prodObj.products[b].starRating * 2) / 2).toFixed(1);
            if (stars > 0) {
							var starsClass = "stars" + (stars * 10);
							productResults += '<span class="reviewNum">&nbsp;(<a href="">' + prodObj.products[b].reviewNum + '</a>)</span>';
							productResults += '<span class="starRatings ' + starsClass + '">' + prodObj.products[b].starRating + '  stars</span> ';
            }
            productResults += '</span>';

            // pricing display
            // start table
            productResults += '<div class="tableBlock"><table class="priceTiers" border="0" cellpadding="0" cellspacing="0"><tbody><tr><th class="UOM" colspan="3">';
            // table header content

            // savingsStory
            var savedText = prodObj.products[b].priceSvgs;
            if (savedText.length > 0) {
              // replace the dumb non-breaking space
              // savedText = savedText.replace(" ", " ");
              savedText = savedText.replace("\u00A0", " ");
              productResults += '<span class="greenSave">' + savedText + '</span>';
            }

            // Uom
            productResults += '<span class="uomText">Price when you buy</span>';

            productResults += '</th></tr>';

            // price tiers
            for(j=0; j < prodObj.products[b].priceTiers.length; j++) {

              // get the qty number
              var qtyPrice = prodObj.products[b].priceTiers[j].tierNum;


              // add + only if not top tier
              if (qtyPrice != "1") {
                qtyPrice = qtyPrice + '+';
              } else {
                qtyPrice = qtyPrice + ' ' + prodObj.products[b].uomTxt;
              }
              // get the was price
              var showWasPrice = prodObj.products[b].priceTiers[j].tierWasPrice;
              // get the qty price
              var topPrice = prodObj.products[b].priceTiers[j].tierPrice;


              // embolden and redify the price for the top tier
              if (j == 0) {
                qtyPrice = '<span class="topQty">' + qtyPrice + '</span>';
                showWasPrice = '<span class="topWas">' + showWasPrice + '</span>';
                topPrice = '<span class="topPrice">' + topPrice + '</span>';
              }

              productResults += '<tr class="rowPrice">';
              productResults += '<td class="qtyCol">' + qtyPrice + '</td>';
              productResults += '<td class="savingsCol">' + showWasPrice + '</td>';
              productResults += '<td class="bestPrice">' + topPrice + '</td>';
              productResults += '</tr>';
            }

            // close table
            productResults += '</tbody></table>';

            // show link if more price tiers
            if (prodObj.products[b].priceTiers.length > 3) {
               productResults += '<span class="showPrices"><a href="#showPrices">Show more prices +</a></span>';
            }
            productResults += '</div>';

            // add to cart line
            productResults += '<label class="qtyLabel" for="qty' + prodObj.products[b].skuID + '">Qty:</label><br /><input class="qtyField" id="qty' + prodObj.products[b].skuID + '" sku="' + prodObj.products[b].skuID + '" value="1"> <button class="addToCart" sku="' + prodObj.products[b].skuID + '">Add to Cart</button>';

            // favorites
            productResults += '<span class="favListIcon formLabel favListBtn scTrack" title="Save to your favorites list." sctype="scLink" scvalue="savetofavorites" id="ATL_[SKUID]" data-url="/mylist/CreateUpdateFavorite?listtype=1" onclick="Utilities.ShowFavoriteList(this, false, false);" data-sku="[SKUID]" data-printnumber="{itemnumber}" data-description=""></span>';

            var checkQuick = prodObj.products[b].quickShip;
            if (checkQuick == "y") {
              productResults += '<div class="quick-ship-molecule"><img id="quick-ship-icn" src="../images/icons/quick-ship-icn-gray1.svg" />Quick Ship: 1-2 business days</div>';
            }
            var checkLife = prodObj.products[b].lifeTime;
            if (checkLife == "y") {
              productResults += '<div class="life-time-molecule"><img id="life-time-icn" src="../images/icons/feathersGray2icn2.png?v=2" />Lifetime Warranty</div>';
            }


            // end content
          productResults += '</div>';  // end the prodInfoWrap

          productResults += '</div>';  // end search grid block

        }

        $("#jsonResults").html(productResults);
        // console.log("priceT length: " + prodObj.products[0].priceTiers.length);



     } else {
        $("#jsonResults").html("Use the search box above to try another search");
     }


}
