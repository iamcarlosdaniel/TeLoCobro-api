# TeLoCobro-API

![](https://img.shields.io/badge/Release%20-%20v1.0.0-%23007EC6)

![](docs/banner.png)

La API de TeLoCobro ofrece una interfaz robusta y flexible que permite a los desarrolladores interactuar con TeLoCobro de manera eficiente. Esta API está diseñada para facilitar el acceso y la gestión de datos, permitiendo realizar operaciones como consultar, actualizar, eliminar y crear información. Con un enfoque RESTful y una comunicación basada en HTTP(S), la API está optimizada para integrarse fácilmente en diversas plataformas y aplicaciones.

## Primeros pasos

1. Clona el repositorio a tu máquina local:

   ```sh
   git clone https://github.com/iamcarlosdaniel/TeLoCobro-api
   ```

2. Navega al directorio del proyecto:

   ```sh
   cd TeLoCobro-api
   ```

3. Instala las dependencias necesarias:

   ```sh
   npm install
   ```

4. Inicia el servidor de desarrollo:

   ```sh
   npm run dev
   ```

> El proyecto está configurado para ejecutarse en el puerto 3000, así que asegúrate de que este puerto esté disponible para su uso y verifica la conexión a la base de datos. Puedes encontrar estas y otras opciones en las variables de entorno del proyecto ubicadas en el archivo .env.

## Documentación de la API

<img src="docs/swagger_logo.svg" alt="Logo de Swagger" width="300">

Swagger es un conjunto de herramientas de código abierto que ayuda en el diseño, construcción, documentación y consumo de APIs RESTful. Proporciona una forma estandarizada y visual de interactuar con las APIs, mejorando la comprensión y utilización de sus endpoints.

Swagger es especialmente útil en entornos donde la colaboración entre los equipos de desarrollo y pruebas es esencial, ya que ofrece un método claro y estandarizado para documentar y consumir APIs.

Utilizamos esta herramienta mediante el middleware [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express).

Puedes encontrar la documentación de la API en la siguiente ruta:

```
http://localhost:3000/api/v1/docs
```

Asegúrate de que el proyecto esté en ejecución y que el puerto 3000 no esté ocupado para poder acceder a esta ruta.

> Puedes cambiar el número de puerto y otras opciones en las variables de entorno del proyecto ubicadas en el archivo `.env`.

## Dependencias

Puedes ver las dependencias del proyecto junto con sus versiones en el archivo [package.json](package.json).
