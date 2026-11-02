CREATE TABLE contract_secretariat_aliases (
  alias TEXT PRIMARY KEY,
  canonical_name TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('accepted', 'needs_review')),
  rationale TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO contract_secretariat_aliases (alias, canonical_name, decision, rationale) VALUES
  ('Secretaria de  Educacao', 'Secretaria de Educacao', 'accepted', 'Difere apenas por espaço duplicado.'),
  ('Secretaria Infraestrutura Serv. Urbanos', 'Secretaria Infraestrutura e Serv.urbanos', 'accepted', 'Variação abreviada inequívoca no mesmo contexto administrativo.')
ON CONFLICT (alias) DO NOTHING;
