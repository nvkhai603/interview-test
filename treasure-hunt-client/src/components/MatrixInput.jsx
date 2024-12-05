import { Button } from "@mui/material"
import { TextField } from 'formik-mui';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from "react-router"

export const MatrixInput = ({ onNext, m, n, p }) => {
    let navigate = useNavigate();
    return <Formik initialValues={{
        n: n,
        m: m,
        p: p
    }}
        validate={(values) => {
            const errors = {};
            if (!values.n && values.n !== 0) {
                errors.n = 'Cần nhập số n';
            } else if (values.n > 500 || values.n < 1) {
                errors.n = 'Số m phải từ 1 đến 500';
            }


            if (!values.m && values.m !== 0) {
                errors.m = 'Cần nhập số m';
            } else if (values.m > 500 || values.m < 1) {
                errors.m = 'Số m phải từ 1 đến 500';
            } else if(values.m == 1 && values.n == 1){
                errors.m = 'Số m và n không thể cùng bằng 1'
            }


            if (!values.p && values.p !== 0) {
                errors.p = 'Cần nhập số p';
            } else if (values.p > values.m * values.n || values.p < 1) {
                errors.p = `Số p phải từ 1 đến ${values.m * values.n} [m*n]`;
            }

            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                setSubmitting(false);
                onNext(values)
                // alert(JSON.stringify(values, null, 2));
            }, 500);
        }}
    >
        {({ submitForm, isSubmitting }) => (
            <Form className="space-y-8 min-h-[400px] flex flex-col">
                <div className="p-4 bg-blue-50 rounded">
                    <div>
                        Cấu trúc bản đồ là dữ liệu đầu vào để tạo ma trận bản đồ các hòn đảo, bao gồm:
                        <ul className="list-disc list-inside">
                            <li><strong>n</strong>: Số hàng của ma trận các hòn đảo</li>
                            <li><strong>m</strong>: Số cột của ma trận các hòn đảo</li>
                            <li><strong>p</strong>: Số loại rương có thể có trên ma trận các hòn đảo</li>
                        </ul>
                        <span className="text-orange-500 italic">Lưu ý: {"(1 <= n, m <= 500 , 1 <= p <= n*m)"}</span>
                    </div>
                </div>
                <div className="w-full flex justify-center grow space-x-6">
                    <Field
                        component={TextField}
                        name="n"
                        type="number"
                        size="small"
                        label="n"
                    />

                    <Field
                        component={TextField}
                        name="m"
                        type="number"
                        label="m"
                        size="small"
                    />

                    <Field
                        component={TextField}
                        name="p"
                        type="number"
                        label="p"
                        size="small"
                    />
                </div>
                <div className="flex justify-between border-t p-4">
                    <Button
                        color="secondary"
                        onClick={() => {
                            navigate("/")
                        }}
                    >
                        Quay lại
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                        Tiếp tục
                    </Button>
                </div>
            </Form>
        )}
    </Formik>

}