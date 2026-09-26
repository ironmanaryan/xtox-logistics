-- Demo shipments for tracking (safe to re-run)
insert into public.shipments (tracking_code, origin, destination, status, current_location, eta_date)
values
  ('XTX123456', 'Surat, GJ', 'Mumbai JNPT Port', 'in_transit', 'Vapi checkpoint', current_date + 2),
  ('XTX789012', 'Nashik, MH', 'Dubai (Jebel Ali)', 'out_for_delivery', 'Jebel Ali customs', current_date + 1),
  ('XTX345678', 'Nashik, MH', 'Rotterdam, NL', 'delivered', 'Rotterdam DC', current_date - 3)
on conflict (tracking_code) do nothing;
