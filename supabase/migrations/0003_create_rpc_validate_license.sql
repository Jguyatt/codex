create or replace function validate_license(license_key text, machine_hash text)
returns boolean
language plpgsql
as $$
declare
    license_record licenses%rowtype;
begin
    select * into license_record from licenses where licenses.license_key = validate_license.license_key limit 1;
    if license_record.id is null then
        return false;
    end if;
    if license_record.machine_hash is not null and license_record.machine_hash <> validate_license.machine_hash then
        return false;
    end if;
    if license_record.expires_at is not null and license_record.expires_at < now() then
        return false;
    end if;
    return true;
end;
$$;
