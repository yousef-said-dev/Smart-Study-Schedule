import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { scheduleGenerateSchema } from '../../utils/validationSchemas';
import { scheduleService } from '../../services/scheduleService';
import { subjectService } from '../../services/subjectService';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ScheduleGenerator = ({ subject, onScheduleGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!subject) {
      subjectService.getAll().then(res => setSubjects(res.data.data.subjects));
    }
  }, [subject]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const subjectId = subject?._id || values.subjectId;

      const response = await scheduleService.generate(subjectId, values.dailyAvailability);
      toast.success('Schedule generated successfully!');

      if (onScheduleGenerated) {
        onScheduleGenerated(response.data.data.schedule);
      }

      navigate('/schedule');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const initialValues = {
    subjectId: subject?._id || '',
    dailyAvailability: 3,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={scheduleGenerateSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          {!subject && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <Field
                as="select"
                name="subjectId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Choose a subject...</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (Exam: {formatDate(s.examDate)})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="subjectId" component="div" className="mt-1 text-sm text-red-600" />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Availability (hours)</label>
            <Field
              name="dailyAvailability"
              type="number"
              step="0.5"
              min="0"
              max="24"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 3"
            />
            <ErrorMessage name="dailyAvailability" component="div" className="mt-1 text-sm text-red-600" />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting || loading}
            className="w-full"
          >
            Generate Smart Schedule
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ScheduleGenerator;