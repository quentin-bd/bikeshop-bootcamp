const stripe = require('stripe')('sk_test_51JY5mQI5OOBrRdrnkn72r7yjxgnHQ3uirY23DJaeveNZpU5pcaJpaXiVozEcJr7rCxEX8vPxd4yyHOP43TG0jRGV00yLQDV1nv');
var express = require('express');
var router = express.Router();



var dataBike = [
  {
    name: 'BIKO45',
    url: './images/bike-1.jpg',
    price: 679
  },
  {
    name: 'ZOOK7',
    url: './images/bike-2.jpg',
    price: 799
  },
  {
    name: 'LIKO89',
    url: './images/bike-3.jpg',
    price: 839
  },
  {
    name: 'GEWO8',
    url: './images/bike-4.jpg',
    price: 1249
  },
  {
    name: 'KIWIT',
    url: './images/bike-5.jpg',
    price: 899
  },
  {
    name: 'NASAY',
    url: './images/bike-1.jpg',
    price: 1399
  },

]


/* GET home page. */
router.get('/', function (req, res, next) {
  
  res.render('index', { dataBike });
});

router.get('/shop', function (req, res, next) {
  let bikePic = req.query.url;
  let bikeModel = req.query.name;
  let bikePrice = req.query.price;
  if(!req.session.dataCardBike){
    req.session.dataCardBike = []
  }
  var dataCardBike = req.session.dataCardBike;
// ****** je boucle pour trouver la position et je push si elle n'existe aps dans l'array ***** //

  // var position = -1;
  // for (i = 0; i < dataCardBike.length; i++){
  //   if(dataCardBike[i].name == bikeModel) {
  //     dataCardBike[i].quantity += 1; 
  //     position = i;  
  //   }
  // }
  // if(position == -1){
  //   dataCardBike.push({name: bikeModel, url: bikePic, price: bikePrice, quantity: 1,});
  // } 

 // **************************************************************************************** // 

 var position = dataCardBike.findIndex(bike => bike.name == bikeModel);
 if(position >= 0) {
   dataCardBike[position].quantity++
 } else {
  dataCardBike.push({name: bikeModel, url: bikePic, price: bikePrice, quantity: 1,});
 }
  
  res.render('shop', { dataCardBike, emptyCard: 'Your card is empty' });
});

router.get('/delete-shop', function(req, res, next) {
  let trashIndex = req.query.trashIndex;
  var dataCardBike = req.session.dataCardBike;
  dataCardBike.splice(trashIndex, 1);
  res.render('shop', {dataCardBike, emptyCard: 'Your card is empty.'}) 
})

router.post('/update-shop', function(req, res, next) {
  let quantity = req.body.quantity;
  let index = req.body.hIndex;
  var dataCardBike = req.session.dataCardBike;
  console.log('datacardbike.quantity est egal à ' + quantity);
  dataCardBike[index].quantity = quantity;
  console.log(dataCardBike);
  res.render('shop', {dataCardBike, quantity})
})




router.post('/create-checkout-session', async (req, res) => {
  var checkoutCard = [];
  var dataCardBike = req.session.dataCardBike;
  
  
  dataCardBike.forEach(item => { checkoutCard.push(    
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }
  )})

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: checkoutCard, 
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });

  res.redirect(303, session.url);
});

router.get('/cancel', function(req, res, next) {
  
  res.render('cancel', {title: 'Paiement canceled'})
});

router.get('/success', function(req, res, next) {
  
  res.render('success', {title: 'Paiement succeed'})
});

module.exports = router;