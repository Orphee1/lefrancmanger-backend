# Routes 

_**Note: The port used in request are dummy, see the .env fille in environment configuration**_
## Read ALL Producers for internal test ...
> * **GET** //localhost:3100/producers

## Read ALL Producers with filters (in production)
> * **POST** //localhost:3100/producers
> ### Mandatory parameters in body
> * longitute / latitude / radius  **if missing one, parametres are not used _return empty with error "parameter missing"_ **
>> radius in meters
> ### Optionnal parameters in body
> * Categories, [String]
> * Sub-Categories, [String]


## Read ONE Producer
> * **POST** //localhost:3100/producer?id=_producter_id_
> * all fields are populate with mongoose

## Create ONE Producers

## Update ONE Producers

## Delete ONE Producers
