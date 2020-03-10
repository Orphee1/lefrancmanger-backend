### Le Franc Manger Model

## Producers model

```javascript
{
  "name": { type: String, unique: true, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    zipCode: { type: String }
  },
  email: { type: String },
  phone: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  loc: {
    type: [Number], // Longitude et latitude
    index: "2dsphere" // Créer un index geospatial
  },
  description: [String],
  photos: [Object],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  meansOPayment: { cheque: Boolean, cash: Boolean, card: Boolean },
  timeSlot: [Object],
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
}
```
## Producers exemple:
```json
{
        "address": {
            "street": "rue de la palmeraie",
            "city": "paris",
            "zipCode": "75010"
        },
        "location": {
            "type": "Point",
            "coordinates": [
                2.243333,
                48.906667
            ]
        },
        "loc": [
            2.333333,
            48.866667
        ],
        "meansOPayment": {
            "cheque": false,
            "cash": false,
            "card": false
        },
        "description": [
            "BlaBlaBla"
        ],
        "photos": [
            {
                "secure_url": "https://res.cloudinary.com/dvcdbwbpi/image/upload/v1575466717/yi1xkwjcinhbp4o0bmle.png",
                "public_id": "yi1xkwjcinhbp4o0bmle"
            }
        ],
        "products": [],
        "timeSlot": [
            {
                "Monday": {
                    "isOpen": false,
                    "availability": "08H00-12H00 13H00-18H00"
                }
            },
            {
                "Tuesday": {
                    "isOpen": true,
                    "availability": "08H00-12H00 13H00-18H00"
                }
            },
            {
                "Wednesday": {
                    "isOpen": true,
                    "availability": "08H00-12H00 13H00-18H00"
                }
            },
            {
                "Thursday": {
                    "isOpen": true,
                    "availability": "08H00-12H00 13H00-18H00"
                }
            },
            {
                "Friday": {
                    "isOpen": true,
                    "availability": "08H00-12H00 13H00-18H00"
                }
            },
            {
                "Saturday": {
                    "isOpen": true,
                    "availability": "08H00-12H00 13H00-18H00"
                }
            }
```
# Comments

The field **"description"** is a array of string, more than one field can exist, by convention :
* First field is use for the Title of the description.
* Second field is use for the Sub-Title of the description.
* Third field and more is use for the Chapter.
The can be a blank.
> Exemple : 
```javascript
["Title","","Chapter one","Chapter two"]
```

The field **"name"** is the name of the producer.

The field **"timeSlot"** is populate with all week's day
The field **"availability"** can contain a string like :
* "08H00-12H00 13H00-18H00" or
* "08H00-12H00" or
* ""

```json
"timeSlot": [ { "Monday": {
                    "isOpen": false,
                    "availability": "08H00-12H00 13H00-18H00"
                }  },
```
