const formatarData = (dataISO: string): string => {
 
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
    throw new Error("Formato inválido. Use AAAA-MM-DD");
  }

  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default formatarData