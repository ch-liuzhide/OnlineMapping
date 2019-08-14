// use localStorage to store the authority info, which might be sent from server in actual project.
//if from sever,setAuthority can delete
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['member', 'guest'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('GEO_authority') : str;
  // authorityString could be member, "member", ["member"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  if (!authority) {
    return ['guest'];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('GEO_authority', JSON.stringify(proAuthority));
}
