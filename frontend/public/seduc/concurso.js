(function(){
  var CIDADES = [['BALNEARIO CAMBORIU/SC', 'BALNEÁRIO CAMBORIÚ/SC'], ['BLUMENAU/SC', 'BLUMENAU/SC'], ['CANOINHAS/SC', 'CANOINHAS/SC'], ['CHAPECO/SC', 'CHAPECÓ/SC'], ['CRICIUMA/SC', 'CRICIÚMA/SC'], ['FLORIANOPOLIS/SC', 'FLORIANÓPOLIS/SC'], ['JOACABA/SC', 'JOAÇABA/SC'], ['JOINVILLE/SC', 'JOINVILLE/SC'], ['LAGES/SC', 'LAGES/SC'], ['RIO DO SUL/SC', 'RIO DO SUL/SC'], ['SAO MIGUEL DO OESTE/SC', 'SÃO MIGUEL DO OESTE/SC'], ['TUBARAO/SC', 'TUBARÃO/SC']];
  var C = {
    pmpe: {
      titulo: 'PMSC 2026', sigla: 'PMSC', orgao: 'Polícia Militar de Santa Catarina',
      edital_opt: 'PMSC 2026 - Concurso Público nº 002/CCP/2026',
      edital_curto: 'Edital nº 002/CCP/2026 – PMSC',
      orgao_edital: 'Polícia Militar de Santa Catarina - Edital nº 002/CCP/2026',
      logo: '/idcap/img/pmsc-logo.png',
      cargos: [
        {v: '201', t: 'Soldado do Quadro de Praças Policial Militar (QPPM)', p: '200.00'}
      ],
      pagina: '/pmpe.html'
    }
  };
  var ALIAS = {assistente: 'pmpe'};
  function norm(k){ k = ALIAS[k] || k; return C[k] ? k : ''; }
  var key = 'pmpe';
  try {
    var q = norm(new URLSearchParams(location.search).get('c') || '');
    if (q) { key = q; localStorage.setItem('concurso_sel', q); }
    else { var s = norm(localStorage.getItem('concurso_sel') || ''); if (s) { key = s; localStorage.setItem('concurso_sel', s); } }
  } catch (e) {}
  var cur = C[key];
  window.SEAD_CONCURSO = {key: key, cfg: cur};

  function fill(){
    document.querySelectorAll('[data-c]').forEach(function(el){
      var k = el.getAttribute('data-c');
      if (cur[k] != null) el.textContent = cur[k];
    });
    document.querySelectorAll('[data-c-src]').forEach(function(el){
      var k = el.getAttribute('data-c-src');
      if (cur[k] != null) el.setAttribute('src', cur[k]);
    });
    var vaga = document.getElementById('VAGA');
    if (vaga && !vaga.dataset.cfg) {
      vaga.dataset.cfg = key;
      vaga.innerHTML = '<option value="">Selecione</option>' + cur.cargos.map(function(c){
        return '<option value="' + c.v + '" data-price="' + c.p + '">' + c.v + '  -  ' + c.t + '  -  R$ ' + c.p.replace('.', ',') + '</option>';
      }).join('');
    }
    var mp = document.getElementById('MUNICIPIO_PROVA');
    if (mp && !mp.dataset.cfg) {
      mp.dataset.cfg = key;
      var prev = mp.value;
      mp.innerHTML = '<option value="">Selecione</option>' + CIDADES.map(function(c){ return '<option value="' + c[0] + '" data-uf="SC">' + c[1] + '</option>'; }).join('');
      if (CIDADES.some(function(c){ return c[0] === prev; })) mp.value = prev;
    }
    var uf = document.getElementById('UF_PROVA'); if (uf) uf.value = 'SC';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
  window.addEventListener('load', function(){
    var v = document.getElementById('VAGA'); if (!v) return;
    var sv = ''; try { sv = (JSON.parse(localStorage.getItem('inscricao_dados') || '{}').VAGA) || ''; } catch (e) {}
    v.value = sv; v.dispatchEvent(new Event('change', {bubbles: true}));
    if (v.selectedIndex < 0) v.selectedIndex = 0;
  });
})();
