DECLARE
    employees_cursor   SYS_REFCURSOR;
    l_token            apex_jwt.t_token;
    V_IS_USER_EXIST    NUMBER;
    V_ID               NUMBER;
    USER_OBJECT        apex_json.t_values;
BEGIN
    IF :Authorization IS NULL
    THEN
        APEX_JSON.open_object;
        APEX_JSON.write ('message', 'Error');
        APEX_JSON.close_object;
        :status := 401;
        RETURN;
    END IF;

    l_token :=
        apex_jwt.DECODE (
            p_value   => :Authorization,
            p_signature_key   =>
                sys.UTL_RAW.cast_to_raw (
                    'ikjsdjv89j9j23hoakdjHGHg788*^%^75sdhsddgfhghfgh'));

    apex_jwt.VALIDATE (p_token            => l_token,
                       p_iss              => 'Example Issuer',
                       p_aud              => 'Example JWT Recipient',
                       p_leeway_seconds   => 0);

    apex_json.parse (USER_OBJECT, l_token.payload);

    IF NOT apex_json.does_exist (p_path => 'id', p_values => USER_OBJECT)
    THEN
        APEX_JSON.open_object;
        APEX_JSON.write ('message', 'Error');
        APEX_JSON.close_object;
        :status := 401;
        RETURN;
    END IF;

    V_ID := apex_json.GET_NUMBER (p_path => 'id', p_values => USER_OBJECT);

    SELECT COUNT (*)
      INTO V_IS_USER_EXIST
      FROM emp
     WHERE EMPNO = V_ID;

    IF V_IS_USER_EXIST <= 0
    THEN
        APEX_JSON.open_object;
        APEX_JSON.write ('message', 'Error');
        APEX_JSON.close_object;
        :status := 401;
        RETURN;
    END IF;

    OPEN employees_cursor FOR
        SELECT empno     "$uri",
               rn,
               empno,
               ename,
               job,
               hiredate,
               mgr,
               sal,
               comm,
               deptno
          FROM (SELECT emp.*, ROW_NUMBER () OVER (ORDER BY empno) rn FROM emp)
               tmp;

    APEX_JSON.open_object;
    APEX_JSON.write ('data', employees_cursor);
    APEX_JSON.write ('message', 'Success');
    APEX_JSON.close_object;
EXCEPTION
    WHEN OTHERS
    THEN
        APEX_JSON.open_object;
        APEX_JSON.write ('message', 'Error');
        APEX_JSON.close_object;
        :status := 401;
END;