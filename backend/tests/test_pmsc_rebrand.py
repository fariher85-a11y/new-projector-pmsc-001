# PMSC 2026 rebrand: email builders, from_name, telegram sigla, public pages
import os
import sys
import re
import pytest
import requests

sys.path.insert(0, "/app/backend")
import email_service as es  # noqa: E402
import admin_routes as ar  # noqa: E402

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
BAD = ("Pernambuco", "PMPE", "CBMPE")


def _clean(html):
    for b in BAD:
        assert b not in html, f"found {b}"


# Email builders
def test_concurso_de():
    assert es.concurso_de("Soldado") == ("PMSC 2026", "Polícia Militar de Santa Catarina",
                                         "Edital nº 002/CCP/2026 · Organização: Instituto AOCP")


def test_prazo():
    assert es.PRAZO == "16/11/2026, às 23h59 (horário de Brasília)"


def test_cadastro_email():
    h = es.build_cadastro_email_html(nome="TEST User", cpf="12345678901", nascimento="1990-01-01",
                                     email="t@example.com", cidade="Florianópolis",
                                     base_url="https://example.com", sessao="abc")
    _clean(h)


@pytest.mark.parametrize("lembrete", ["", "20/11/2026, às 23h59"])
def test_inscricao_email(lembrete):
    h = es.build_inscricao_email_html(nome="TEST User", cpf="12345678901", protocolo="123",
                                      cargo="201 - Soldado (Praça da Polícia Militar QPPM) - R$ 180,00",
                                      concurso="PMPE_26", valor=180, base_url="https://example.com",
                                      lembrete_prazo=lembrete)
    _clean(h)
    assert "PMSC 2026" in h and "Polícia Militar de Santa Catarina" in h
    assert "16/11/2026, às 23h59" in h
    es._assert_safe_email("x", h)


def test_pix_email():
    h = es.build_pix_email_html(nome="TEST User", cpf="12345678901", cargo="Soldado", valor=180, pix_code="000201")
    _clean(h)
    assert "PMSC 2026" in h and "Polícia Militar de Santa Catarina" in h


# admin_routes helpers
@pytest.mark.parametrize("c,cg", [("PMPE_26", "Soldado"), ("CBMPE", "Oficial"), ("", "")])
def test_from_name(c, cg):
    r = ar._from_name_inscricao(c, cg)
    assert r == "Inscrição Polícia Militar SC" and "PE" not in r


def test_telegram_sigla():
    m = ar._build_telegram_message({"nome": "TEST", "cpf": "12345678901", "concurso": "CBMPE", "cargo": "Bombeiro"}, {})
    assert "PMSC" in m
    for b in BAD:
        assert b not in m


# Public pages
def test_cbmpe_removed():
    r = requests.get(f"{BASE_URL}/cbmpe.html", timeout=20)
    assert r.status_code == 404 or "CBMPE" not in r.text


def test_pmpe_modal_date():
    r = requests.get(f"{BASE_URL}/pmpe.html", timeout=20)
    assert r.status_code == 200
    assert "16/11/2026" in r.text
    assert "15/11/2026" not in r.text


def test_logo():
    r = requests.get(f"{BASE_URL}/idcap/img/pmsc-logo.png", timeout=20)
    assert r.status_code == 200 and r.headers.get("content-type", "").startswith("image")
