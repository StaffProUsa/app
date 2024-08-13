import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  SButtom,
  SHr,
  SIcon,
  SNavigation,
  SPage,
  SScrollView2,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import PButtom from '../Components/PButtom';

const Texto = `TÉRMINOS Y CONDICIONES DE USO APP\n
Los siguientes términos y condiciones rigen el uso que usted le
dé a esta app y a cualquiera de los contenidos disponibles
por o a través de esta app, incluyendo cualquier contenido
derivado del mismo (la "App"). Servisofts Srl. ("Servisofts Srl." o "nosotros")
ha puesto a su disposición la App. Podemos cambiar los Términos
y Condiciones de vez en cuando, en cualquier momento sin ninguna notificación,
sólo publicando los cambios en la App. AL USAR LA APP, USTED ACEPTA
Y ESTÉ DE ACUERDO CON ESTOS TÉRMINOS Y CONDICIONES EN LO QUE SE REFIERE A SU
USO DE LA MISMA. Si usted no está de acuerdo con estos Términos y
Condiciones, no puede tener acceso ni usar esta App de ninguna otra manera.


1. Derechos de Propiedad.
Entre usted y Servisofts Srl., Servisofts Srl. es dueño único y exclusivo, de todos los
derechos, título e intereses en y de la App, de todo el contenido (incluyendo,
por ejemplo, audio, fotografías, ilustraciones, gráficos, otros medios visuales, videos,
copias, textos, software, títulos, archivos de Onda de choque, etc.), códigos, datos
y materiales del mismo, el aspecto y el ambiente, el diseño y la organización de la App
y la compilación de los contenidos, códigos, datos y los materiales en la misma,
incluyendo pero no limitado a, cualesquiera derechos de autor, derechos de marca,
derechos de patente, derechos de base de datos, derechos morales, derechos sui generis y
otras propiedades intelectuales y derechos patrimoniales del mismo. Su uso 
no le otorga propiedad de ninguno de los contenidos, códigos, datos o materiales a los que
pueda acceder en o a través de de app.


2. Licencia Limitada
Usted puede acceder y ver el contenido de la app desde cualquier dispositivo y, 
a menos de que se indique de otra manera en estos Términos y Condiciones o en
esta app, sacar copias o impresiones individuales del contenido de la app para su
uso personal, interno únicamente. El uso de la app y de los servicios que se ofrecen en
o a través de la app, son sólo para su uso personal, no comercial.


3. Uso Prohibido.
Cualquier distribución, publicación o explotación comercial o promocional de la app, o
de cualquiera de los contenidos, códigos, datos o materiales en la app, está estrictamente
prohibida, a menos de que usted haya recibido el previo permiso expreso por escrito del personal
autorizado de Servisofts Srl. o de algún otro poseedor de derechos aplicable. A no ser como está
expresamente permitido en el presente contrato, usted no puede descargar, informar, exponer,
publicar, copiar, reproducir, distribuir, transmitir, modificar, ejecutar, difundir, transferir,
crear trabajos derivados de, vender o de cualquier otra manera explotar cualquiera de los
contenidos, códigos, datos o materiales en o disponibles a través de la app. Usted se
obliga además a no alterar, editar, borrar, quitar, o de otra manera cambiar el significado o la
apariencia de, o cambiar el propósito de, cualquiera de los contenidos, códigos, datos o
materiales en o disponibles a través de la app, incluyendo, sin limitación, la alteración o
retiro de cualquier marca comercial, marca registrada, logo, marca de servicios o cualquier otro
contenido de propiedad o notificación de derechos de propiedad. Usted reconoce que no adquiere
ningún derecho de propiedad al descargar algún material con derechos de autor de o a través de la app.
Si usted hace otro uso de la app, o de los contenidos, códigos, datos o materiales
que ahí se encuentren o que estén disponibles a través de la app, a no ser como se ha
estipulado anteriormente, usted puede violar las leyes de derechos de autor y otras leyes de
los Estados Unidos y de otros países, así como las leyes estatales aplicables, y puede ser sujeto
a responsabilidad legal por dicho uso no autorizado.


4. Marcas Comerciales.
Las marcas comerciales, logos, marcas de servicios, marcas registradas (conjuntamente las
"Marcas Comerciales") expuestas en la app o en los contenidos disponibles a través de la app
 son Marcas Comerciales de Servisofts Srl. registradas y no registradas y otras, y no
pueden ser usadas con respecto a productos y/o servicios que no estén relacionados, asociados
o patrocinados por sus poseedores de derechos y que puedan causar confusión a los clientes, o
de alguna manera que denigre o desacredite a sus poseedores de derechos. Todas las Marcas
Comerciales que no sean de Servisofts Srl. que aparezcan en la app o en o a través de los
servicios de la app, si las hubiera, son propiedad de sus respectivos dueños. Nada que
esté contenido en la app deberá ser interpretado como otorgando, por implicación,
desestimación, o de otra manera, alguna licencia o derecho para usar alguna Marca Comercial
expuesta en la app sin el permiso escrito de Servisofts Srl. o de terceros que puedan ser
dueños de dicha Marca Comercial. El mal uso de las Marcas Comerciales expuestas en la app
o en o a través de cualquiera de los servicios de la app está estrictamente prohibido.


5. Información del Usuario.
En el curso del uso que usted haga de la app y/o de los servicios puestos a su disposición
en o a través de la app, se le puede pedir que nos proporcione cierta información
personalizada (dicha información en lo sucesivo "Información del Usuario"). Las políticas de
uso y recopilación de información de Servisofts Srl. con respecto a la privacidad de dicha
Información del Usuario se establecen en la Política de Privacidad de la app, la cual
está incorporada al mismo como referencia para todos los propósitos. Usted reconoce y acepta
ser el único responsable de la exactitud del contenido de la Información del Usuario.


6. Materiales Presentados.
A menos que se solicite específicamente, no pedimos ni deseamos recibir ninguna información
confidencial, secreta o patrimonial, ni otro material de usted a través de la app, por
correo electrónico o de cualquier otra manera. Cualquier información, trabajos creativos,
demostración, ideas, sugerencias, conceptos, métodos, sistemas, diseños, planes, técnicas u
otros materiales que nos haya mandado o presentado (incluyendo, por ejemplo y sin limitación,
aquello que usted presenta o envía a nuestros grupos de chateo, tablas de mensajes y/o a
nuestros ‘blogs’, o que nos manda vía correo electrónico) ("Materiales Presentados") se
considerará como no confidencial o secreto y que puede ser usado por nosotros de cualquier
manera consistente con la Política de Privacidad de la app. Al presentarnos o mandarnos
Materiales Presentados, usted: (i) representa y garantiza que los Materiales Presentados
son originales suyos, que ninguna otra persona tiene ningún derecho sobre ellos, y que cualquier
derecho moral" sobre los Materiales Presentados ha sido renunciado, y (ii) usted nos concede,
a nosotros y a nuestros afiliados, derecho y licencia libres de regalías, sin restricciones,
mundiales, perpetuos, irrevocables, no exclusivos y totalmente transferibles, que pueden ser
cedidos y sub-licenciados, para usar, copiar, reproducir, modificar, adaptar, publicar, traducir,
crear trabajos derivados de, distribuir, ejecutar, exponer e incorporar en otros trabajos
cualquiera de los Materiales Presentados (todos o en parte) en cualquier forma, medio o
tecnología no conocida o por desarrollar, incluyendo propósitos promocionales y/o comerciales.
No podemos ser responsables de conservar ningún Material Presentado proporcionado por usted y
podemos borrar o destruir dicho Material Presentado en cualquier momento.


7. Conducta Prohibida del Usuario.
Usted garantiza y está de acuerdo en que, mientras use la app y los diversos servicios
y artículos que se ofrecen en o a través de la app, usted no: (a) personalizará a ninguna
persona o entidad ni desvirtuará su afiliación con alguna otra persona o entidad;
(b)  insertará su propio anuncio, posicionamiento de marca o algún otro contenido promocional o
el de un tercero  en cualquiera de los contenidos, materiales o servicios o materiales dla app
(por ejemplo, sin limitación, en una actualización RSS o en un programa de radio grabado (podcast)
recibido de Servisofts Srl. o de algún otro modo a través de la app), ni usará, redistribuirá,
republicará o explotará dichos contenidos o servicios con cualquier otro propósito adicional
comercial o promocional; ni (c) intentará ganar acceso no autorizado a otros sistemas de
cómputo a través de la app. Usted no: (i) participará en navegar por la red, en "raspar 
(scraping) la pantalla", "raspar (scraping) la base da datos", en recolectar direcciones de 
correo electrónico, direcciones inalámbricas u otra información personal o de contactos, o
cualquier otro medio automático de obtener listas de usuarios u otra información de o a través
de la app o de los servicios ofrecidos en o a través de la app, incluyendo, sin limitación,
cualquier información que se encuentre en algún servidor o base de datos relacionada con la app
o los servicios ofrecidos en o a través de la app; (ii) obtendrá o intentará obtener acceso no
autorizado a los sistemas de cómputo, materiales o información por cualquier medio; (iii) usará la
app o los servicios puestos a su disposición en o a través de la app de alguna manera
con la intención de interrumpir, dañar, deshabilitar, sobrecargar o deteriorar la app o
dichos servicios, incluyendo, sin limitación, mandar mensajes masivos no solicitados o "inundar"
servidores con solicitudes; (iv) usará la app o los servicios o artículos de la app en
violación de la propiedad intelectual o de otros derechos legales o patrimoniales de Servisofts Srl.
o de algún tercero; ni (v) usará la app o los servicios de la app en violación de cualquier
ley aplicable. Usted se obliga además, a no intentar (o alentar o apoyar el intento de otro) a embaucar,
destruir, decodificar, o de otro modo alterar o interferir con la app o con los servicios de la app
, o con cualquier contenido del mismo, o hacer cualquier uso no autorizado del mismo.
Usted se obliga a no usar la app de alguna manera que pudiera dañar, deshabilitar, sobrecargar o
deteriorar la app o interferir con que cualquier otra persona pueda usar o disfrutar dla app
o de cualquiera de sus servicios. Usted no obtendrá ni intentará obtener algún material o información
a través de cualquier medio que no haya sido estipulado o puesto a la disposición del público
intencionalmente a través de la app.


8. Foros Públicos.
Servisofts Srl. puede, de vez en cuando, tener servicios de mensajería, servicios de chateo, tableros de noticias,
blogs, otros foros y otros servicios disponibles en o a través de la app. Además de cualquier otra normatividad
y regulación que podamos publicar con respecto a un servicio en particular, usted se obliga a no cargar, informar,
transmitir, distribuir o de otra manera publicar a través de la app o de cualquier servicio o artículo puesto
a la disposición en o a través de la app, cualquier material que (i) restrinja o inhiba a cualquier otro
usuario de usar y disfrutar de la app o de los servicios de la app, (ii) sea fraudulento, ilegal, amenazante,
abusivo, hostigante, calumnioso, difamatorio, obsceno, vulgar, ofensivo, pornográfico, profano,
sexualmente explícito o indecente, (iii) constituya o aliente conductas que pudieran constituir una ofensa criminal,
dar lugar a responsabilidad civil o de otro modo violar cualquier ley local, estatal, nacional o internacional,
iv) viole, plagie o infrinja los derechos de terceros incluyendo, sin limitación, derechos de autor, marcas comerciales,
secretos comerciales, confidencialidad, contratos, patentes, derechos de privacidad o publicidad o cualquier otro derecho
de propiedad, (v) contenga un virus, elemento de espionaje u otro componente dañino, (vi) contenga enlaces fijos,
publicidad, cartas de cadenas o esquemas de pirámides de cualquier tipo, o (vii) constituya o contenga indicaciones
de origen, endosos o declaraciones de hechos falsos o engañosos. Usted además se obliga a no personificar a cualquier
otra persona o entidad, ya sea real o ficticia, incluyendo cualquier persona de Servisofts Srl. Usted tampoco puede
ofrecer comprar o vender algún producto o servicio en o a través de sus comentarios presentados en nuestros foros.
Solamente usted es responsable del contenido y de las consecuencias de cualquiera de sus actividades.


9. Derecho de Monitoreo y Control Editorial.
Servisofts Srl. se reserva el derecho, pero no tiene la obligación, de monitorear y/o revisar todos los materiales
enviados a la app o a través de los servicios o artículos de la app por los usuarios, y Servisofts Srl. no es
responsable de dichos materiales enviados por los usuarios. Sin embargo, Servisofts Srl. se reserva el derecho en todo
momento de divulgar cualquier información que sea necesaria para satisfacer cualquier ley, reglamento o solicitud
gubernamental, o de editar, rehusarse a colocar o a quitar cualquier información o materiales, todos o en parte, que
a discreción únicamente de Servisofts Srl. sean censurables o en violación de estos Términos de Uso, de las políticas de
Servisofts Srl. o de la ley aplicable. También podemos imponer límites sobre ciertos artículos de los foros o restringir
su acceso a parte o a todos los foros sin notificación o sanción, si creemos que usted está en incumplimiento de las
directrices establecidas en este párrafo, nuestros términos y condiciones o la ley aplicable, o por cualquier otra razón
sin notificación o responsabilidad.

10. Información Privada o Delicada en Foros Públicos
Es importante recordar que los comentarios presentados en un foro pueden ser registrados y almacenados en múltiples
lugares, tanto en nuestra app como en otra parte en Internet, los cuales pueden ser accesibles durante mucho
tiempo y no se tiene control sobre quién los leerá eventualmente. Es por lo tanto importante que tenga usted cuidado
y sea selectivo acerca de la información personal que divulgue acerca de usted y de otros, y en especial, no debe
divulgar información delicada, patrimonial o confidencial en sus comentarios en nuestros foros públicos.

`;

class TerminosCondiciones extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SPage title={'Términos y condiciones'} center disableScroll>
        <SView
          col={'xs-12'}
          center
          height
          backgroundColor={STheme.color.background}>
          <SScrollView2 disableHorizontal>
            <SView col={'xs-12'} center>
              <SView col={'xs-11 md-6 xl-4'} center>
                <SHr height={30} />
                <SText
                  color={STheme.color.text}
                  fontSize={14}
                  style={{
                    textAlign: 'justify'
                  }}
                  font={'Roboto'}>
                  {Texto}
                </SText>
                <SHr height={200} />
              </SView>
            </SView>
          </SScrollView2>

          <SView
            col={'xs-12 md-8 xl-4'}
            center
            height={120}
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: STheme.color.background,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: 'hidden'
            }}>
            <SView>
              <SView col={'xs-12'} center>
                <PButtom
                  small
                  fontSize={13}
                  width={150}
                  center
                  onPress={() => {
                    SNavigation.goBack();
                  }}>
                  Aceptar
                </PButtom>
              </SView>
            </SView>
          </SView>
        </SView>
      </SPage>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(TerminosCondiciones);
