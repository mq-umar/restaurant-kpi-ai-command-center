# Security Notes

This public portfolio copy is intentionally synthetic.

Do not commit:

- `.env` or `.env.local`
- Toast credentials or restaurant GUIDs
- 7shifts access tokens or real location IDs
- Google service account JSON
- Google Sheet IDs from the live company account
- Raw Toast CSV/XLSX/ZIP exports
- Real company sales, labor, food cost, or vendor data

Production secrets belong in Vercel Environment Variables only. Browser code should never call Toast, 7shifts, or private Google Sheets directly.
