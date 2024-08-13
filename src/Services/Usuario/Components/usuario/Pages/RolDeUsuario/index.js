import {Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {SImage, SLoad, STheme, SView} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import {SSRolesPermisosValidate} from '../../../../SSRolesPermisos';

const RolDeUsuario = (props) => {
  if (!props.data) return <View />;
  if (!props.data.key) return <View />;

  if (!SSRolesPermisosValidate({page: 'UsuarioPage', permiso: 'ver_rol'})) {
    return <View />;
  }
  var data = props.state.rolReducer.data;
  if (!data) {
    if (props.state.rolReducer.estado == 'cargando') {
      return <SLoad />;
    }
    var object = {
      component: 'rol',
      type: 'getAll',
      key_usuario: props.state.usuarioReducer.usuarioLog.key,
      estado: 'cargando'
    };
    SSocket.send(object);
    // props.state.socketReducer.session[AppParams.socket.name].send(object, true);
    return <View />;
  }

  var key_usuario = props.data.key;
  if (!key_usuario) {
    return <SLoad />;
  }
  var usuarioRol = props.state.usuarioRolReducer.usuario[key_usuario];
  if (!usuarioRol) {
    if (props.state.usuarioRolReducer.estado == 'cargando') {
      return <SLoad />;
    }
    if (props.state.usuarioRolReducer.estado == 'error') {
      return <SLoad />;
    }
    var object = {
      component: 'usuarioRol',
      type: 'getAll',
      estado: 'cargando',
      key_usuario: key_usuario
    };
    SSocket.send(object);
    return <View />;
  }

  const getRoles = () => {
    var isAddSuperUsuario = SSRolesPermisosValidate({
      page: 'UsuarioPage',
      permiso: 'add_rol_super_usuario'
    });
    var Lista = Object.keys(data).map((key) => {
      var obj = data[key];
      var isActivo = false;
      if (key == '01726154-c439-4d63-99a1-0615d9e15f15') {
        if (!isAddSuperUsuario) {
          return <View />;
        }
      }
      if (usuarioRol[key]) {
        var key_nn = usuarioRol[key];
        isActivo = props.state.usuarioRolReducer.data[key_nn];
        if (isActivo.estado == 0) {
          isActivo = false;
        }
      }
      return (
        <TouchableOpacity
          style={{
            width: '40%',
            maxWidth: 170,
            height: 160,
            margin: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ffffff44',
            backgroundColor: STheme.color.card
            // padding:4,
          }}
          onPress={() => {
            if (
              SSRolesPermisosValidate({
                page: 'UsuarioPage',
                permiso: 'editar_rol',
                isAlert: true
              })
            ) {
              if (!isActivo) {
                var object = {
                  component: 'usuarioRol',
                  type: 'registro',
                  key_usuario: props.state.usuarioReducer.usuarioLog.key,
                  estado: 'cargando',
                  data: {
                    key_rol: key,
                    key_usuario: props.data.key
                  }
                };
                SSocket.send(object);
              } else {
                var object = {
                  component: 'usuarioRol',
                  type: 'editar',
                  key_usuario: props.state.usuarioReducer.usuarioLog.key,
                  estado: 'cargando',
                  data: {...isActivo, estado: 0}
                };
                SSocket.send(object);
              }
            }
            // props.navigation.navigate("PermisoCrearPage", { key: objPermiso.key });
          }}>
          <View
            style={{
              flex: 1
            }}>
            <View
              style={{
                padding: 8,
                backgroundColor: '#ffffff11',
                height: 120,
                borderRadius: 8,
                overflow: 'hidden'
              }}>
              <SImage src={SSocket.api.rp + 'rol/' + obj.key} />
              {/* {props.state.imageReducer.getImage(AppParams.servicios["roles_permisos"] + "rol/" + obj.key, {})} */}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: STheme.color.secondary
                }}>
                {obj.descripcion}
              </Text>
            </View>
          </View>
          {isActivo ? (
            <View />
          ) : (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 8,
                backgroundColor: '#000000dd',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}>
                Activar
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    });
    return (
      <SView row center>
        {Lista}
      </SView>
    );
  };
  // var pagina = props.state.usuarioPageReducer.data["UsuarioPage"];
  // if (!pagina) {
  //     return <View />;
  // }
  // if (!pagina.permisos["editar_roles"]) {
  //     return <View />;
  // }
  return (
    <SView style={{}}>
      <Text
        style={{
          padding: 8,
          fontSize: 12,
          color: '#999',
          width: '100%',
          textAlign: 'center'
        }}>
        Tipos de usuario
      </Text>
      {getRoles()}
    </SView>
  );
};

const initStates = (state) => {
  return {state};
};
export default connect(initStates)(RolDeUsuario);
