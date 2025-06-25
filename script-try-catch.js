//GET
//CATCH



/**as
 * 
 * a = a + b;
 * funcaoA();
 * funcaoB();//lance falha
 * 
 * return 'hello';
 */





try {
  let a = a + b;
  funcaoA();
  funcaoB();//lance falha
  
} catch(error) {
  divMensagem.textContent = 'Error ao fazer algo';
  console.lof(error);
} finally {
  return 'hello';
}


