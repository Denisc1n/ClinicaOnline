# ClinicaOnline

La Clinica Online es un sistema de gestion de turnos. Su objetivo es facilitar la solicitud, atencion y evaluacion de pacientes y doctores que utilicen la plataforma, asi como proveer herramientas de reportes para poder llevar un control de operaciones.

## Tecnologia

Stack de tecnologias: El stack utilizado consiste en Angular (Incluyendo Angular Material), Typescript, y Firebase (Database, Storage).

## Caso de Uso

El caso de uso se basa en una clinica que permite a sus profesionales registrarse indicando datos minimos y especialidades, para luego necesitar ser validados internamente por un perfil administrador. Asimismo, los pacientes tambien deben registrarse en la plataforma validando su correo electronico.

## Perfiles

### Administrador

Este perfil posee los atributos para administrar cualquier entidad dentro de la plataforma. Como la intencion de este proyecto es que sea "Llave en mano" El administrador se entrega generado (MasterAdmin) para luego desde ese usuario generar los administradores que hagan falta para la operacion.

### Paciente

El paciente es una de los usuarios finales que maneja la plataforma. Sus funciones incluyen la solicitud de turnos y la redaccion de reseñas a doctores que lo atendieron.

### Doctor

El doctor es la entidad esencial ya que permite la correcta operatoria. Puede atender turnos, escribir reseñas y actualizar historias clinicas de los pacientes que atiende. Todo esto mientras puede tambien cambiar sus horarios de trabajo, cancelar turnos en caso de ser necesario y tambien validar informacion de los turnos actuales.

## ¿Como lo Uso?

### Login

Inicialmente, el usuario final se encontrara en una pantalla de login, desde aqui podra registrarse o bien iniciar sesion con sus credenciales.

![](/readme_resources/login.png "Pantalla:")

### Registro

En principio se debe indicar que perfil se desea generar, luego se veran dos formularios posibles:
![](/readme_resources/registroPaso1.png "Pantalla:")

#### Registro Paciente

Formulario de registro Paciente:

![](/readme_resources/registroPasoPaciente.png "Pantalla:")

#### Registro Doctor

Formulario de registro Doctor:

![](/readme_resources/registroPasoProfesional.png "Pantalla:")

#### Validacion de correo

El correo electronico se valida para ambos perfiles. Se envia un correo electronico de verificacion desde firebase, al clickear el link la cuenta se encuentra activada y pueden acceder. Con la salvedad de los doctores, que ademas deberan ser validados por un administrador.

#### Paciente

El paciente sera dirigido a su pantalla principal, donde podra ver sus turnos actuales con acciones tales como cancelar, dar una reseña y ver la reseña recibida.
![](/readme_resources/principalPaciente.png "Pantalla:")

##### Pedir turno

El paciente podra elegir profesionales y horarios:
![](/readme_resources/pedirTurno.png "Pantalla:")

#### Doctor

El doctor, al iniciar sesion, sera redirigido a su pantalla principal, donde podra ver proximos turnos, cancelarlos, atenderlos, dar reseñas, y configurar sus horarios.
![](/readme_resources/principalDoctor.png "Pantalla:")

##### Horarios

Para configurar horarios simplemente debe especificar que dias de la semana y en que franja horaria.
![](/readme_resources/horariosDoctor.png "Pantalla:")

#### Administrador

El administrador tiene su propia pagina principal tambien, desde donde podra generar nuevos administradores o habilitar profesiones, entre otras.

![](/readme_resources/principalAdmin.png "Pantalla:")

##### Dar de alta profesionales

Para dar de alta un profesional, al ingresar a la opcion desde la pagina principal se vera una tabla con datos una clara opcion de Habilitar.

![](/readme_resources/habilitacionDeProfesionales.png "Pantalla:")

##### Generar otros administradores

Si en cambio, se quiere generar otros administradores, solo basta con completar este formulario.

![](/readme_resources/registroAdministrador.png "Pantalla:")
