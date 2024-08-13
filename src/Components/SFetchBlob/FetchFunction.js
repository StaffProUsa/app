export const progresFormat = (byte, progres) => {
  if(!byte){
      byte=1;
  }
  if(!progres){
      progres=1;
  }
  var resp = {
      size: formatByte(byte),
      received: formatByte(progres),
      porcent: (progres / byte),
      time: new Date().getTime(),
  };
  return resp
}

export const formatByte = (byte) => {
  var size = byte;
  var sKb = size / 1024;
  var sMb = sKb / 1024;
  var sGb = sMb / 1024;
  var val = "";
  if (sGb > 1) {
      val = sGb.toFixed(1) + " Gb"
  } else if (sMb > 1) {
      val = sMb.toFixed(1) + " Mb"
  } else if (sKb > 1) {
      val = sKb.toFixed(1) + " Kb"
  } else {
      val = size + " b"
  }
  return {
      byte: size,
      val: val,
      kb: sKb.toFixed(1),
      mg: sMb.toFixed(1),
      gb: sGb.toFixed(1),
  }
}

export default {
  formatByte,
  progresFormat,
}