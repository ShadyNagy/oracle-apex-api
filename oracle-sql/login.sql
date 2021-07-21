DECLARE
    V_TOKEN           VARCHAR2 (3000);
    V_IS_USER_EXIST   NUMBER;
    V_USER_NO         NUMBER;
    V_USER_JOB        VARCHAR2 (3000);
BEGIN
    SELECT COUNT (*)
      INTO V_IS_USER_EXIST
      FROM emp
     WHERE LOWER(ENAME) = LOWER(:userName);

    IF V_IS_USER_EXIST <= 0
    THEN
        APEX_JSON.open_object;
        APEX_JSON.write ('message', 'Error1');
        APEX_JSON.close_object;
        RETURN;
    END IF;

    SELECT EMPNO, JOB
      INTO V_USER_NO, V_USER_JOB
      FROM emp
     WHERE LOWER(ename) = LOWER(:userName);

    V_Token :=
        apex_jwt.encode (
            p_iss       => 'Example Issuer',
            p_sub       => 'Example User',
            p_aud       => 'Example JWT Recipient',
            p_nbf_ts    => NULL,
            p_iat_ts    => SYSDATE,
            p_exp_sec   => 60 * 5,
            p_jti       => NULL,
            p_other_claims   =>
                   '"id": '
                || apex_json.stringify (V_USER_NO)
                || ',"job": '
                || apex_json.stringify (V_USER_JOB),
            p_signature_key   =>
                sys.UTL_RAW.cast_to_raw (
                    'ikjsdjv89j9j23hoakdjHGHg788*^%^75sdhsddgfhghfgh'));

    APEX_JSON.open_object;
    APEX_JSON.write ('data', V_Token);
    APEX_JSON.write ('message', 'Success');
    APEX_JSON.close_object;
END;