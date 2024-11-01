
# Servidor Near Bites


![Logo de la App](https://github.com/as-Solo/Near-Bites/blob/main/src/assets/images/cabecera-readme.png)
### [Ver la App!](https://nearbites.netlify.app/)

## Descripción

Near Bites es una aplicación web dinámica que utiliza geolocalización para ayudar a los usuarios a encontrar restaurantes cercanos. Además de ofrecer la posibilidad de filtrar resultados y gestionar reservas, los propietarios de los restaurantes pueden editar y gestionar su presencia online.

#### [Repositorio Cliente aquí](https://github.com/as-Solo/Near-Bites)
#### [Repositorio Servidor aquí](https://github.com/as-Solo/Near-Bites-server)

## Funcionalidades Planeadas

- Mejorar la seguridad y privacidad de las rutas.
- Añadir al panel de control de los propietarios la posibilidad de ver y gestionar las reservas correctamente.

## Tecnologías Usadas

- **HTML**: Lenguaje de marcado utilizado para estructurar el contenido de la aplicación web.
- **CSS**: Herramienta para estilizar y mejorar la apariencia visual de la interfaz de usuario.
- **Javascript**: Lenguaje de programación utilizado para la lógica de la aplicación, gestión de eventos y manipulación del DOM.
- **React Context**: Mecanismo de React que permite compartir estados y funciones entre componentes sin necesidad de pasar props manualmente, facilitando la gestión global de datos en la aplicación.
- **[axios](https://axios-http.com/)**: Librería para realizar solicitudes HTTP de manera sencilla, utilizada para interactuar con el servidor y la API.

- **[Vite](https://vitejs.dev/)**: Como el *bundler* para ofrecer una experiencia de desarrollo rápida y eficiente.
- **[React](https://reactjs.org/)**: Para la construcción de la interfaz de usuario, utilizando componentes reutilizables y un enfoque modular.
- **[Express](https://expressjs.com/)**: Manejo del backend, con un enfoque RESTful en las APIs.
- **[MongoDB](https://www.mongodb.com/)** y **[Mongoose](https://mongoosejs.com/)**: Base de datos NoSQL utilizada para gestionar la información de usuarios, restaurantes, comentarios, y reservas.
- **[Leaflet](https://leafletjs.com/)**: Librería para la integración de mapas interactivos y geolocalización.
- **[Cloudinary](https://cloudinary.com/)**: Servicio utilizado para la gestión y almacenamiento de imágenes.
- **[React Spinners](https://www.davidhu.io/react-spinners/)**: Para la integración de *loaders* y mejorar la experiencia de usuario mientras se cargan los datos.

# Estructura del Servidor

## Modelos

Modelo Usuario

```javascript
{
    email: {type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true},
    password: {type: String, required: [true, 'Password is required.']},
    name: {type: String, trim: true, default:""},
    lastname: {type: String, trim: true, default:""},
    username: {type: String, unique: true, trim: true, required: [true, 'Username is required.'], default:""},
    image: {type: String, trim: true},
    coords: [String],
    rol: {type: String, enum:["user", "owner", "admin"], default: "user"},
    favourites: { type: [Schema.Types.ObjectId], ref: "Restaurant", default:[]},
    wishlist: { type: [Schema.Types.ObjectId], ref: "Restaurant", default:[]},
    restaurantsOwned: {type: [Schema.Types.ObjectId], ref: "Restaurant", default: []}
  }
```

Modelo Restaurante

```javascript
{
    profileImage: {type: String, trim: true},
    images: {type: [String], trim: true},
    name: {type: String, trim: true, required: true},
    description: {type: String, trim: true},
    coords: {type: [Number], index: "2dsphere", unique: true, trim: true},
    rating: {type: Number, default:0},
    price: {type: Number},
    address: {type: String, trim: true, required: true},
    city: {type: String, trim: true, required: true},
    country: {type: String, trim: true, required: true},
    zip_code: {type: String, trim: true, required: true},
    categories: {type: [String]},
    capacity: {type: Number},
    timeSlots: {type: [String], default: ["20:00", "21:00", "22:00", "23:00", "00:00"]},
    isDiscount: {type: Boolean, default: false},
    discountAmount: {type: Number, default: 0.0},
    likes: {type: [Schema.Types.ObjectId], ref: "User", default:[]}
  }
```

Modelo Reseña
```javascript
{
    description: {type: String,  required: true},
    rating: {type: Number, default: 3},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant", required: true},
}
```
Modelo Reserva
```javascript
{
    partySize: {type: Number, required: true},
    day: {type: Date, required: true},
    startHour: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant", required: true}
  }
```
## Puntos de Entrada de la API (rutas del servidor)

| Método HTTP | URL                              | Cuerpo de Petición                                                            | Éxito Status | Error Status | Descripción                                                       |
| ----------- | --------------------------------- | ----------------------------------------------------------------------------- | ------------ | ------------ | ----------------------------------------------------------------- |
| POST        | `/auth/signup`                   | {name, email, password}                                                       | 201          | 400          | Registra al usuario en la Base de Datos                           |
| POST        | `/auth/login`                    | {username, password}                                                          | 200          | 400          | Valida las credenciales, crea y envía Token                       |
| GET         | `/auth/verify`                   |                                                                               | 200          | 401          | Verifica el Token del usuario                                     |
| GET         | `/users`                         |                                                                               | 200          | 400          | Ver todos los usuarios                                            |
| POST        | `/users`                         | {email, password, name, lastname, username, image}                           | 201          | 400          | Crear un nuevo usuario                                            |
| GET         | `/users/profile`                 |                                                                               | 200          | 401          | Ver un usuario concreto                                            |
| PATCH       | `/users/profile`                 | {name, lastname, username, image}                                            | 200          | 400, 401     | Editar un usuario en concreto                                      |
| DELETE      | `/users/profile`                 |                                                                               | 200          | 401          | Eliminar un usuario concreto                                       |
| GET         | `/users/wishlist`                |                                                                               | 200          | 401          | Ver la wishlist de un usuario concreto                             |
| GET         | `/users/wishlist/populate`       |                                                                               | 200          | 401          | Ver la wishlist de un usuario concreto con detalles de los restaurantes |
| PUT         | `/users/fav/:restaurantId`      |                                                                               | 200          | 400, 401     | Añadir un restaurante a la lista de deseos                       |
| PUT         | `/users/unfav/:restaurantId`    |                                                                               | 200          | 400, 401     | Eliminar un restaurante de la lista de deseos                    |
| GET         | `/users/pinimage`               |                                                                               | 200          | 401          | Recuperar la imagen de un usuario                                 |
| GET         | `/users/owner`                  |                                                                               | 200          | 401          | Ver la lista de restaurantes de un usuario propietario            |
| PUT         | `/api/users/follow/:userId`      | -                                        | 200          | 400          | Sigue a un usuario especificado por su ID.                      |
| PUT         | `/api/users/unfollow/:userId`    | -                                        | 200          | 400          | Deja de seguir a un usuario especificado por su ID.             |
| GET         | `/api/users/is-following/:userId`| -                                        | 200          | 400          | Comprueba si el usuario autenticado sigue a otro usuario.        |
| GET         | `/api/users/followers`           | -                                        | 200          | 400          | Cuenta el número de seguidores del usuario autenticado.          |
| GET         | `/api/users/is-accepted/:userId` | -                                        | 200          | 400          | Comprueba si se ha aceptado a otro usuario.                     |
| GET         | `/api/users/is-request/:userId`  | -                                        | 200          | 400          | Comprueba si hay una solicitud de amistad pendiente.             |
| PUT         | `/api/users/request/:userId`     | -                                        | 200          | 400          | Envía una solicitud de amistad a otro usuario.                  |
| GET         | `/api/users/request-list`         | -                                        | 200          | 400          | Ver la lista de solicitudes de amistad pendientes.              |
| PUT         | `/api/users/request/yes/:userId` | -                                        | 200          | 400          | Acepta la solicitud de amistad de otro usuario.                 |
| PUT         | `/api/users/request/no/:userId`  | -                                        | 200          | 400          | Rechaza la solicitud de amistad de otro usuario.                |
| GET         | `/api/users/chat/:userId`        | -                                        | 200          | 400          | Recupera la imagen y nombre de usuario para el chat.           |
| GET         | `/restaurants`                   |                                                                               | 200          | 400          | Ver todos los restaurantes                                        |
| POST        | `/restaurants`                   | {profileImage, images, name, description, coords, rating, price, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount} | 201          | 400          | Crear un nuevo restaurante                                        |
| GET         | `/restaurants/:restaurantId`     |                                                                               | 200          | 400          | Ver un restaurante específico                                      |
| PATCH       | `/restaurants/:restaurantId`     | {profileImage, images, name, description, coords, rating, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount} | 200          | 400          | Editar un restaurante                                             |
| DELETE      | `/restaurants/:restaurantId`     |                                                                               | 200          | 400          | Eliminar un restaurante                                           |
| GET         | `/restaurants/:longitude/:latitude/:distance/:limit` |                                                                               | 200          | 400          | Obtener restaurantes cercanos                                     |
| PUT         | `/restaurants/like`              | {restaurantId}                                                                | 200          | 401          | Añadir un restaurante a la lista de favoritos                    |
| PUT         | `/restaurants/unlike`            | {restaurantId}                                                                | 200          | 401          | Eliminar un restaurante de la lista de favoritos                 |
| GET         | `/restaurants/:restaurantId/time_slots` |                                                                               | 200          | 400          | Obtener time slots de un restaurante                              |
| GET         | `/restaurants/unique/categories`  |                                                                               | 200          | 400          | Obtener todas las categorías únicas                                |
| POST        | `/restaurants/filters/dinamicos/:longitude/:latitude/:distance/:limit` | {queryString, categoriesList}                                               | 200          | 400          | Filtrar restaurantes dinámicamente                                |
| GET         | `/restaurants/user/like`         |                                                                               | 200          | 401          | Obtener todos los restaurantes que le gustan a un usuario       |
| PATCH       | `/restaurants/owner/:restaurantId` | {profileImage, categories, images, timeSlots, capacity, isDiscount, discountAmount} | 200          | 401          | Permitir al propietario del restaurante editarlo                 |
| POST        | `/upload`                        | {image}                                                                      | 200          | 400          | Subir una imagen                                                  |
| GET         | `/reviews`                       |                                                                               | 200          | 400          | Ver todas las reseñas                                            |
| POST        | `/reviews`                       | {description, rating, restaurant}                                            | 201          | 400          | Crear una reseña                                                  |
| GET         | `/reviews/:reviewId`            |                                                                               | 200          | 400          | Ver una reseña específica                                         |
| PATCH       | `/reviews/:reviewId`            | {description}                                                                | 200          | 400          | Editar una reseña                                                |
| DELETE      | `/reviews/:reviewId`            |                                                                               | 200          | 400          | Eliminar una reseña                                              |
| GET         | `/reviews/:restaurantId/with_users` |                                                                               | 200          | 400          | Ver todas las reseñas con detalles de los usuarios               |
| GET         | `/messages/conversation/:userId`           |                                                                                                   | 200          | 401          | Obtener la conversación entre el usuario logueado y el destinatario |
| POST        | `/messages/:userId`                        | {message}                                                                                          | 201          | 400          | Enviar un mensaje a un usuario específico                        |
| GET         | `/messages/group-by/conversation/:userId` |                                                                                                   | 200          | 401          | Obtener mensajes agrupados por día entre dos usuarios           |
| GET         | `/messages/chatlist`                       |                                                                                                   | 200          | 401          | Ver la lista de conversaciones abiertas                           |

  
## Enlaces

### Autor

[Alejandro S. del Solo](https://github.com/as-Solo)


### Proyecto

[Repositorio Cliente](https://github.com/as-Solo/Near-Bites)

[Repositorio Servidor](https://github.com/as-Solo/Near-Bites-server)

[Despliegue](https://nearbites.netlify.app/)