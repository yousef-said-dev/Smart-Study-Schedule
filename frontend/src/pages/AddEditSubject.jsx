import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { subjectSchema } from '../utils/validationSchemas';
import subjectService from '../services/subjectService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AddEditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    difficulty: 3,
    totalHours: 10,
    examDate: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    if (id) {
      fetchSubject();
    }
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await subjectService.getById(id);
      const subject = response.data.data.subject;
      setInitialValues({
        ...subject,
        examDate: new Date(subject.examDate).toISOString().split('T')[0],
      });
    } catch (error) {
      toast.error('Failed to load subject');
      navigate('/subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (id) {
        await subjectService.update(id, values);
        toast.success('Subject updated successfully!');
      } else {
        await subjectService.create(values);
        toast.success('Subject created successfully!');
      }
      navigate('/subjects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Subject' : 'Add New Subject'}
        </h1>
        <p className="text-gray-600">
          {id ? 'Update your subject details' : 'Create a new subject to study'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={subjectSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Data Structures"
                />
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Optional description..."
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty (1-5)</label>
                  <Field
                    name="difficulty"
                    type="number"
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <ErrorMessage name="difficulty" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
                  <Field
                    name="totalHours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <ErrorMessage name="totalHours" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                <Field
                  name="examDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <ErrorMessage name="examDate" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <Field
                  name="color"
                  type="color"
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <ErrorMessage name="color" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  className="flex-1"
                >
                  {id ? 'Update Subject' : 'Create Subject'}
                </Button>
                <Link to="/subjects" className="flex-1">
                  <Button type="button" variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEditSubject;